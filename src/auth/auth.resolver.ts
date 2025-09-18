import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  LoginInput,
  RegisterShopInput,
  UpdatePasswordInput,
  AuthUser,
  UpdateProfileInput,
} from './dto/auth.dto';
import { AuthResponse, RegisterResponse } from '../common/dto/response.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse)
  async shopLogin(
    @Args('input') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.shopLogin(loginInput);
  }

  @Mutation(() => RegisterResponse)
  async registerShop(
    @Args('input') registerInput: RegisterShopInput,
  ): Promise<RegisterResponse> {
    return this.authService.registerShop(registerInput);
  }

  @Mutation(() => AuthResponse)
  async refreshToken(@Args('token') token: string): Promise<AuthResponse> {
    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async logout(@Context() context: any): Promise<boolean> {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async updatePassword(
    @Args('input') updatePasswordInput: UpdatePasswordInput,
    @Context() context: any,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    return this.authService.updatePassword(
      userId,
      updatePasswordInput.oldPassword,
      updatePasswordInput.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => AuthUser)
  async getProfile(@Context() context: any): Promise<AuthUser> {
    const userId = context.req.user.id;
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => AuthUser)
  async updateProfile(
    @Args('input') updateProfileInput: UpdateProfileInput,
    @Context() context: any,
  ): Promise<AuthUser> {
    const userId = context.req.user.id;
    return this.authService.updateProfile(userId, updateProfileInput);
  }
}
