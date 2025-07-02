import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field() name: string;
  @Field() email: string;
  @Field() password: string;
}

@InputType()
export class LoginInput {
  @Field() email: string;
  @Field() password: string;
}

@ObjectType()
export class AuthResponse {
  @Field() token: string;
  @Field() name: string;
  @Field() email: string;
}
