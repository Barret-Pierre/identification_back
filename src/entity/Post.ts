import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length } from "class-validator";
import { User } from "./User";
import { Comment } from "./Comment";
import { UniqueRelation } from "./common";
import { Image } from "./Image";
import { Tag } from "./Tag";

// Création et gestion du schema de donnée de wilder TypeORM
// Class de lecture TypeGraphQL

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  content: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  @Field(() => [Comment])
  comments: Comment[];

  @OneToOne(() => Image)
  @JoinColumn()
  @Field(() => Image)
  image: Image;

  @ManyToMany(() => Tag)
  @JoinTable()
  @Field(() => [Tag])
  tags: Tag[];

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
export class PostInput {
  @Field()
  @Length(5, 500)
  content: string;

  @Field(() => UniqueRelation)
  image: UniqueRelation;

  // Pas accéssible depuis l'api, doit être ajouter depuis le resolver
  createdAt: Date;
  createdBy: User;
}
