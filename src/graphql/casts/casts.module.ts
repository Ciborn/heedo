import { Module } from '@nestjs/common';
import { CastsRepository, CastsService } from './casts.service';
import { DramasRepository } from '../dramas/dramas.service';
import { ActorsRepository } from '../actors/actors.service';
import { googleSheetProvider } from 'src/common/api/google/sheets.service';
import googleAuthProvider from 'src/common/api/google/auth.service';

@Module({
	providers: [
		googleAuthProvider,
		googleSheetProvider,
		ActorsRepository,
		CastsRepository,
		CastsService,
		DramasRepository,
	],
})
export class CastsModule {}
