import { Module } from '@nestjs/common';
import { DramasResolver } from './dramas.resolver';
import { DramasRepository, DramasService } from './dramas.service';
import { googleSheetProvider } from 'src/common/api/google/sheets.service';
import googleAuthProvider from 'src/common/api/google/auth.service';
import { CastsRepository, CastsService } from '../casts/casts.service';
import { ActorsRepository } from '../actors/actors.service';

@Module({
	providers: [
		googleAuthProvider,
		googleSheetProvider,
		ActorsRepository,
		CastsRepository,
		CastsService,
		DramasRepository,
		DramasResolver,
		DramasService,
	],
})
export class DramasModule {}
