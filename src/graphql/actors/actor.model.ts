import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Actor {
	constructor(partial: Partial<Actor>) {
		Object.assign(this, partial);
	}

	@Field()
	localName: string;

	@Field()
	name: string;

	@Field()
	country: string;

	@Field()
	gender: 'F' | 'M';

	@Field(() => Int)
	supportRolesCount: number;

	@Field(() => Int)
	guestRolesCount: number;

	@Field(() => Float)
	score: number;
}
