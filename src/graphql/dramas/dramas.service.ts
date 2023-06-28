import { ClassSerializerInterceptor, Get, Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Drama } from "./drama.model";
import { Repository } from "src/common/api/google/sheets.service";

function parseDate(date: string | undefined) {
	const match = date?.match(/(?:(?:(?<day>[0-9]{2})\/)?(?<month>[0-9]{2})\/)?(?<year>[0-9]{4})/);

	if (match?.groups) {
		const day = parseInt(match.groups.day);
		const month = parseInt(match.groups.month);
		const year = parseInt(match.groups.year);

		return new Date(year, month - 1, day);
	}
}

@Injectable()
export class DramasRepository extends Repository<Drama> {
	private worksheet: GoogleSpreadsheetWorksheet;

	constructor(
		@Inject('GOOGLE_SHEET') googleSheet: GoogleSpreadsheet,
	) {
		super();
		this.worksheet = googleSheet.sheetsById['0'];
	}

	protected async getRows() {
		const rows = await this.worksheet.getRows<Record<
			'country'
			| 'localName'
			| 'originalName'
			| 'year'
			| 'category'
			| 'genre'
			| 'rating'
			| 'lastEp'
			| 'watch1start'
			| 'watch1end',
			string
		>>();

		return rows.map(row => {
			const ratingField = row.get('rating') as string;
			const rating = ratingField ? parseFloat(ratingField.replace(',', '.')) : undefined;

			const lastEpField = row.get('lastEp');
			const startedAtField = row.get('watch1start');
			const finishedAtField = row.get('watch1end');

			let status = 'completed';
			if (!startedAtField) status = 'not-started';
			else if (!finishedAtField && lastEpField !== '(film)') status = 'currently-watching';
			else if (finishedAtField === '(abandonné)') status = 'stopped';

			if (status !== 'not-started') {
				return new Drama({
					_startedAt: parseDate(startedAtField),
					_finishedAt: parseDate(finishedAtField),
					category: row.get('category'),
					country: row.get('country'),
					genre: row.get('genre'),
					id: row.rowNumber,
					localName: row.get('localName'),
					originalName: row.get('originalName'),
					rating,
					year: row.get('year'),
					status,
				});
			}
		}).filter(drama => drama !== undefined) as Drama[];
	}
}

@Injectable()
export class DramasService {
	constructor(
		private dramaRepository: DramasRepository,
	) {}

	private async getAllWithFilter(
		predicates: ((drama: Drama) => boolean)[] = []
	): Promise<Drama[]> {
		const rows = await this.dramaRepository.fetch();

		return rows.filter(drama => predicates.every(p => p(drama)));
	}

	private async getAll() {
		return this.getAllWithFilter();
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	public async findAll(): Promise<Drama[]> {
		return this.getAll();
	}

	public async findAllBy(filters: {
		category?: string,
		country?: string,
		genre?: string,
	}): Promise<Drama[]> {
		const predicates: ((drama: Drama) => boolean)[] = [];

		if (filters.category) predicates.push(drama => drama.category === filters.category);
		if (filters.country) predicates.push(drama => drama.country === filters.country);
		if (filters.genre) predicates.push(drama => drama.genre === filters.genre);

		return this.getAllWithFilter(predicates);
	}
}
