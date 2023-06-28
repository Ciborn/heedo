import { ClassSerializerInterceptor, Get, Inject, Injectable, UseInterceptors } from "@nestjs/common";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Actor } from "./actor.model";
import { Repository } from "src/common/api/google/sheets.service";

@Injectable()
export class ActorsRepository extends Repository<Actor> {
	private worksheet: GoogleSpreadsheetWorksheet;

	constructor(
		@Inject('GOOGLE_SHEET') googleSheet: GoogleSpreadsheet,
	) {
		super();
		this.worksheet = googleSheet.sheetsById['1408870661'];
	}

	protected async getRows() {
		const rows = await this.worksheet.getRows<Record<
			'name'
			| 'country'
			| 'gender'
			| 'supportRoles'
			| 'guestRoles'
			| 'score',
			string
		>>();

		return rows.map(row => {
			const name = row.get('name');

			if (name) {
				return new Actor({
					localName: name,
					country: row.get('country'),
					gender: row.get('gender'),
					supportRolesCount: parseInt(row.get('supportRoles'), 10),
					guestRolesCount: parseInt(row.get('guestRoles'), 10),
					score: parseFloat(row.get('score').replace(',', '.')),
				});
			}
		}).filter(actor => actor !== undefined) as Actor[];
	}
}

@Injectable()
export class ActorsService {
	constructor(
		private actorRepository: ActorsRepository,
	) {}

	private async getAllWithFilter(
		predicates: ((actor: Actor) => boolean)[] = []
	): Promise<Actor[]> {
		const rows = await this.actorRepository.fetch();

		return rows.filter(actor => predicates.every(p => p(actor)));
	}

	private async getAll() {
		return this.getAllWithFilter();
	}

	@Get()
	@UseInterceptors(ClassSerializerInterceptor)
	public async findAll(): Promise<Actor[]> {
		return this.getAll();
	}

	public async findAllBy(filters: {
		country?: string,
		gender?: string,
	}): Promise<Actor[]> {
		const predicates: ((actor: Actor) => boolean)[] = [];

		if (filters.country) predicates.push(actor => actor.country === filters.country);
		if (filters.gender) predicates.push(actor => actor.gender === filters.gender);

		return this.getAllWithFilter(predicates);
	}
}
