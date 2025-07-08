import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ObjectType, Field } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';

@ObjectType()
class HelloType {
  @Field()
  message: string;
}

@Resolver(() => HelloType)
export class HelloResolver {
  @Query(() => HelloType)
  @UseGuards(GqlAuthGuard)
  hello(@CurrentUser() user: any): HelloType {
    return { message: `Hello ${user.email}!` };
  }
}
