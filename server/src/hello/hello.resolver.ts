import { Query, Resolver } from '@nestjs/graphql';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class HelloType {
  @Field()
  message: string;
}

@Resolver(() => HelloType)
export class HelloResolver {
  @Query(() => HelloType)
  hello(): HelloType {
    return { message: 'Hello from Yeasio!' };
  }
}
