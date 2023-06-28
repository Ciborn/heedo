import { ConfigService } from "@nestjs/config";
import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export abstract class Repository<T> {
	private updatedAt = 0;
	
	public cache: T[];

	protected abstract getRows(): Promise<T[]>;

	public async fetch() {
		if (this.updatedAt + 60000 < Date.now()) {
			this.updatedAt = Date.now();
			this.cache = await this.getRows();
		}

		return this.cache;
	}
}

export const googleSheetProvider = {
	provide: 'GOOGLE_SHEET',
	useFactory: async (
		configService: ConfigService,
		serviceAccount: GoogleAuth,
	) => {
		const sheetId = configService.get<string>('GOOGLE_SPREADSHEET_ID');
		const sheet = new GoogleSpreadsheet(sheetId!, serviceAccount);

		await sheet.loadInfo();
		await sheet.sheetsById['0'].loadHeaderRow(3);
		await sheet.sheetsById['1408870661'].loadHeaderRow(2);
		await sheet.sheetsById['1546860382'].loadHeaderRow(2);

		return sheet;
	},
	inject: [ConfigService, 'GOOGLE_AUTH'],
};
