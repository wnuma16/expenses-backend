// Auth resolver for GraphQL
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth-response.dto';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input.email, input.password, input.name);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput) {
    const user = await this.authService.validateUser(input.email, input.password);
    return this.authService.login(user);
  }
}
