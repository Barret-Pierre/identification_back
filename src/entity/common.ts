import { Field, ID, InputType } from "type-graphql";

@InputType()
export class UniqueRelation {
  @Field(() => ID)
  id: number;
}

@InputType()
export class ManyRelations {
  @Field(() => [ID])
  l: number[];
}
