import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "src/common/api/google/sheets.service";
import Cast from "./cast.model";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { ActorsRepository } from "../actors/actors.service";
import { DramasRepository } from "../dramas/dramas.service";


@Injectable()
export class CastsRepository extends Repository<Cast> {
	private worksheet: GoogleSpreadsheetWorksheet;

	constructor(
		private actorsRepository: ActorsRepository,
		private dramasRepository: DramasRepository,
		@Inject('GOOGLE_SHEET') googleSheet: GoogleSpreadsheet,
	) {
		super();
		this.worksheet = googleSheet.sheetsById['1546860382'];
	}

	protected async getRows() {
		const rows = await this.worksheet.getRows<Record<
			'drama'
			| 'actor'
			| 'characterName'
			| 'rating',
			string
		>>();

		const actors = await this.actorsRepository.fetch();
		const dramas = await this.dramasRepository.fetch();

		return rows.map(row => {
			const actorName = row.get('actor');
			const dramaName = row.get('drama');

			if (actorName && dramaName) {
				const actor = actors.find(actor => actor.localName === actorName);
				const drama = dramas.find(drama => drama.localName === dramaName);

				return new Cast({
					actor,
					drama,
					characterName: row.get('characterName') || null,
					rating: row.get('rating'),
				});
			}
		}).filter(cast => cast !== undefined) as Cast[];
	}
}

@Injectable()
export class CastsService {
	constructor(
		private castsRepository: CastsRepository,
	) {}

	findByDramaName(dramaName: string) {
		return this.castsRepository.cache.filter(cast => cast.drama.localName === dramaName);
	}

	findByActorName(actorName: string) {
		return this.castsRepository.cache.filter(cast => cast.actor.localName === actorName);
	}
}
