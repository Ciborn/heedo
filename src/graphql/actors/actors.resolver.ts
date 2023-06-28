import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Actor } from "./actor.model";
import { ActorsService } from "./actors.service";
import { CastsRepository, CastsService } from "../casts/casts.service";
import Cast from "../casts/cast.model";

@Resolver(() => Actor)
export class ActorsResolver {
	constructor(
		private actorsService: ActorsService,
		private castsRepository: CastsRepository,
		private castsService: CastsService,
	) {}

	@Query(() => [Actor])
	actors(
		@Args('country', { type: () => String, nullable: true }) country?: string,
		@Args('gender', { type: () => String, nullable: true }) gender?: string,
	) {
		return this.actorsService.findAllBy({
			country,
			gender,
		});
	}

	@ResolveField('casts', () => [Cast])
	async casts(@Parent() actor: Actor) {
		await this.castsRepository.fetch();

		return this.castsService.findByActorName(actor.localName);
	}
}
