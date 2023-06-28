import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { GqlModule } from './graphql/gql.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		GraphQLModule.forRoot<MercuriusDriverConfig>({
			autoSchemaFile: true,
			driver: MercuriusDriver,
			graphiql: true,
		}),
		GqlModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
