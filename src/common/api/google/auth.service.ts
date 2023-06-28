import { ConfigService } from "@nestjs/config";
import { GoogleAuth } from "google-auth-library";

const googleAuthProvider = {
	provide: 'GOOGLE_AUTH',
	useFactory: async (configService: ConfigService) => {
		const keysJson = configService.get<string>('GOOGLE_AUTH_JSON');
		const credentials = JSON.parse(keysJson!);
		
		const serviceAccount = new GoogleAuth({
			credentials,
			scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});

		return serviceAccount;
	},
	inject: [ConfigService],
}

export default googleAuthProvider;
