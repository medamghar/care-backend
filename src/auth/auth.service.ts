import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginInput, RegisterShopInput, AuthUser, UpdateProfileInput } from './dto/auth.dto';
import { AuthResponse, RegisterResponse } from '../common/dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    // Check if it's a shop login

    // Check if it's a user login (admin, commercial agent, etc.)
    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: {
        role: true,
        commercialAgent: true,
      },
    });

    if (user && user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        return {
          id: user.id,
          phone: user.phone,
          type: 'user',
          role: user.role,
          commercialAgent: user.commercialAgent,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    }

    return null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { phone, password } = loginInput;

    // Validate Moroccan phone number format
    if (!this.isValidMoroccanPhone(phone)) {
      return {
        ok: false,
        message: 'Invalid Moroccan phone number format',
        code: 'INVALID_PHONE_FORMAT',
      };
    }

    const user = await this.validateUser(phone, password);
    if (!user) {
      return {
        ok: false,
        message: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS',
      };
    }

    try {
      const payload = {
        sub: user.id,
        phone: user.phone,
        type: user.type,
        role: user.role.name,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      });

      // Store session
      await this.prisma.session.create({
        data: {
          userId: user.type === 'user' ? user.id : null,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {
        ok: true,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          phone: user.phone,
          role: {
            id: user.role.id || user.role.name,
            name: user.role.name,
            permissions: JSON.stringify(user.role.permissions),
          },
          type: user.type,
          commercialAgent: user.commercialAgent,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch {
      return {
        ok: false,
        message: 'Login failed due to server error',
        code: 'SERVER_ERROR',
      };
    }
  }

  async shopLogin(loginInput: LoginInput): Promise<AuthResponse> {
    const { phone, password } = loginInput;

    // Validate input
    if (!phone || !password) {
      return {
        ok: false,
        message: 'Phone number and password are required',
        code: 'MISSING_CREDENTIALS',
      };
    }

    // Validate Moroccan phone number format
    if (!this.isValidMoroccanPhone(phone)) {
      return {
        ok: false,
        message: 'Invalid Moroccan phone number format',
        code: 'INVALID_PHONE_FORMAT',
      };
    }

    // Check if it's a shop login specifically
    const shop = await this.prisma.shop.findUnique({
      where: { phone },
      include: {
        createdBy: {
          include: { role: true },
        },
      },
    });

    if (!shop) {
      return {
        ok: false,
        message: 'Shop not found with this phone number',
        code: 'SHOP_NOT_FOUND',
      };
    }

    if (shop.status === 'BLOCKED') {
      return {
        ok: false,
        message: 'Shop account has been blocked',
        code: 'SHOP_BLOCKED',
      };
    }

    if (shop.status !== 'APPROVED') {
      return {
        ok: false,
        message: 'Shop account is not approved yet',
        code: 'SHOP_NOT_APPROVED',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, shop.passwordHash);
    if (!isPasswordValid) {
      return {
        ok: false,
        message: 'Incorrect password',
        code: 'INVALID_PASSWORD',
      };
    }

    try {
      const user = {
        id: shop.id,
        phone: shop.phone,
        type: 'shop',
        role: { id: 'shop_owner', name: 'shop_owner', permissions: {} },
        shop: shop,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
      };

      const payload = {
        sub: user.id,
        phone: user.phone,
        type: user.type,
        role: user.role.name,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      });

      // Store session for shop
      await this.prisma.session.create({
        data: {
          userId: null, // Shop sessions don't have userId
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {
        ok: true,
        message: 'Shop login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          phone: user.phone,
          role: {
            id: user.role.id,
            name: user.role.name,
            permissions: JSON.stringify(user.role.permissions),
          },
          type: user.type,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch {
      return {
        ok: false,
        message: 'Login failed due to server error',
        code: 'SERVER_ERROR',
      };
    }
  }

  async registerShop(
    registerInput: RegisterShopInput,
  ): Promise<RegisterResponse> {
    const {
      phone,
      password,
      shopName,
      ownerName,
      city,
      address,
      latitude,
      longitude,
    } = registerInput;

    // Validate Moroccan phone number format
    if (!this.isValidMoroccanPhone(phone)) {
      return {
        ok: false,
        message: 'Invalid Moroccan phone number format',
        code: 'INVALID_PHONE_FORMAT',
      };
    }

    // Check if phone already exists
    const existingShop = await this.prisma.shop.findUnique({
      where: { phone },
    });

    if (existingShop) {
      return {
        ok: false,
        message: 'Phone number already registered',
        code: 'PHONE_ALREADY_EXISTS',
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const shop = await this.prisma.shop.create({
        data: {
          nameAr: shopName,
          ownerName,
          phone,
          passwordHash: hashedPassword,
          city,
          address,
          latitude,
          longitude,
          status: 'PENDING', // Requires admin approval
        },
      });

      return {
        ok: true,
        message: 'Shop registration submitted for approval',
        id: shop.id,
        status: 'PENDING',
      };
    } catch {
      return {
        ok: false,
        message: 'Registration failed due to server error',
        code: 'SERVER_ERROR',
      };
    }
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(token);
      const session = await this.prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            include: {
              role: true,
              commercialAgent: true,
            },
          },
        },
      });

      if (!session || session.expiresAt < new Date()) {
        return {
          ok: false,
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        };
      }

      const newPayload = {
        sub: payload.sub,
        phone: payload.phone,
        type: payload.type,
        role: payload.role,
      };

      const accessToken = this.jwtService.sign(newPayload);

      return {
        ok: true,
        message: 'Token refreshed successfully',
        accessToken,
        refreshToken: token,
        user: {
          id: payload.sub,
          phone: payload.phone,
          role: {
            id: session.user?.role?.id || 'shop_owner',
            name: session.user?.role?.name || 'shop_owner',
            permissions: JSON.stringify(session.user?.role?.permissions || {}),
          },
          type: payload.type,
          commercialAgent: session.user?.commercialAgent,
          createdAt: session.user?.createdAt || new Date(),
          updatedAt: session.user?.updatedAt || new Date(),
        },
      };
    } catch {
      return {
        ok: false,
        message: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      };
    }
  }

  async logout(token: string): Promise<boolean> {
    await this.prisma.session.deleteMany({
      where: { token },
    });
    return true;
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return false;
      }

      const isOldPasswordValid = await bcrypt.compare(
        oldPassword,
        user.passwordHash,
      );
      if (!isOldPasswordValid) {
        return false;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedNewPassword },
      });

      return true;
    } catch {
      return false;
    }
  }

  private isValidMoroccanPhone(phone: string): boolean {
    // Moroccan phone number format: 06XXXXXXXX or 07XXXXXXXX
    const moroccanPhoneRegex = /^0[67]\d{8}$/;
    return moroccanPhoneRegex.test(phone);
  }

  async createDefaultAdmin(): Promise<void> {
    const adminPhone = this.configService.get('ADMIN_PHONE');
    const adminPassword = this.configService.get('ADMIN_PASSWORD');

    // Check if admin role exists
    let adminRole = await this.prisma.role.findUnique({
      where: { name: 'super_admin' },
    });

    if (!adminRole) {
      adminRole = await this.prisma.role.create({
        data: {
          name: 'super_admin',
          permissions: {
            users: ['create', 'read', 'update', 'delete'],
            shops: ['create', 'read', 'update', 'delete', 'approve'],
            products: ['create', 'read', 'update', 'delete'],
            orders: ['create', 'read', 'update', 'delete'],
            promotions: ['create', 'read', 'update', 'delete'],
            notifications: ['create', 'read', 'update', 'delete'],
          },
        },
      });
    }

    // Check if admin user exists
    const existingAdmin = await this.prisma.user.findUnique({
      where: { phone: adminPhone },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await this.prisma.user.create({
        data: {
          phone: adminPhone,
          passwordHash: hashedPassword,
          roleId: adminRole.id,
          isActive: true,
        },
      });
    }
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        commercialAgent: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      phone: user.phone,
      type: 'user',
      role: {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions,
      },
      commercialAgent: user.commercialAgent,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        phone: input.phone,
      },
      include: {
        role: true,
        commercialAgent: true,
      },
    });

    return {
      id: updatedUser.id,
      phone: updatedUser.phone,
      type: 'user',
      role: {
        id: updatedUser.role.id,
        name: updatedUser.role.name,
        permissions: updatedUser.role.permissions,
      },
      commercialAgent: updatedUser.commercialAgent,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}