import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Drama } from "./drama.model";
import { DramasService } from "./dramas.service";
import { CastsRepository, CastsService } from "../casts/casts.service";
import Cast from "../casts/cast.model";

@Resolver(() => Drama)
export class DramasResolver {
	constructor(
		private castsRepository: CastsRepository,
		private castsService: CastsService,
		private dramasService: DramasService,
	) {}

	@Query(() => [Drama])
	dramas(
		@Args('category', { type: () => String, nullable: true }) category?: string,
		@Args('country', { type: () => String, nullable: true }) country?: string,
		@Args('genre', { type: () => String, nullable: true }) genre?: string,
	) {
		return this.dramasService.findAllBy({
			category,
			country,
			genre,
		});
	}

	@ResolveField('casts', () => [Cast])
	async casts(@Parent() drama: Drama) {
		await this.castsRepository.fetch();

		return this.castsService.findByDramaName(drama.localName);
	}
}
