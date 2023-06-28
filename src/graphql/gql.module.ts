import { Module } from '@nestjs/common';
import { ActorsModule } from './actors/actors.module';
import { DramasModule } from './dramas/dramas.module';
import { CastsModule } from './casts/casts.module';

@Module({
	imports: [ActorsModule, DramasModule, CastsModule],
})
export class GqlModule {}
