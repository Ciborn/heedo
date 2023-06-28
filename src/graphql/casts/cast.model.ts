import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Actor } from "../actors/actor.model";
import { Drama } from "../dramas/drama.model";

@ObjectType()
export default class Cast {
	constructor(partial: Partial<Cast>) {
		Object.assign(this, partial);
	}

	@Field()
	actor: Actor;

	@Field()
	drama: Drama;

	@Field({ nullable: true })
	characterName?: string;

	@Field(() => Int, { nullable: true })
	rating?: number;
}
