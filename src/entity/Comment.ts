import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Length } from "class-validator";
import { User } from "./User";
import { Post } from "./Post";
import { UniqueRelation } from "./common";

// Création et gestion du schema de donnée de wilder TypeORM
// Class de lecture TypeGraphQL

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  comment: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @Field(() => Post)
  post: Post;

  @Column()
  @Field(() => Date)
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  createdBy: User;
}

// Class d'écriture TypeGraphQL,
// plus besoin de TypeORM et des champs nécéssaire à la lecture
// Ajout de la validation des champs avec class-validator

@InputType()
export class CommentInput {
  @Field()
  @Length(5, 500)
  comment: string;

  @Field(() => UniqueRelation)
  post: UniqueRelation;

  // Pas accéssible depuis l'api, doit être ajouter depuis le resolver
  createdAt: Date;
  createdBy: User;
}
