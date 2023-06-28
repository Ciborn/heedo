import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

function dateToString(date: Date | undefined) {
	if (date) {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	return null;
}

@ObjectType()
export class Drama {
	constructor(partial: Partial<Drama>) {
		Object.assign(this, partial);
	}

	_startedAt?: Date;
	_finishedAt?: Date;

	@Field(() => Int)
	id: number;

	@Field()
	category: string;

	@Field()
	country: string;

	@Field()
	genre: string;

	@Field()
	localName: string;

	@Field()
	originalName: string;

	@Field(() => Float, { nullable: true })
	rating?: number;

	@Field(() => String, { nullable: true })
	get startedAt(): string | null {
		return dateToString(this._startedAt);
	}

	@Field(() => String, { nullable: true })
	get finishedAt(): string | null {
		return dateToString(this._finishedAt);
	}

	@Field()
	status: string;

	@Field()
	year: string;
}
