import { Module } from '@nestjs/common';
import { ActorsResolver } from './actors.resolver';
import { ActorsRepository, ActorsService } from './actors.service';
import { googleSheetProvider } from 'src/common/api/google/sheets.service';
import googleAuthProvider from 'src/common/api/google/auth.service';
import { CastsRepository, CastsService } from '../casts/casts.service';
import { DramasRepository } from '../dramas/dramas.service';

@Module({
	providers: [
		googleAuthProvider,
		googleSheetProvider,
		ActorsRepository,
		ActorsResolver,
		ActorsService,
		CastsRepository,
		CastsService,
		DramasRepository,
	],
})
export class ActorsModule {}
