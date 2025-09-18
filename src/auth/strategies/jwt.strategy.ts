import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

// Custom JWT extractor that handles undefined authorization headers gracefully
const customJwtExtractor = (req: any) => {
  try {
    // Check for authorization header in different formats
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    
    if (!authHeader) {
      console.log('No authorization header found');
      return null;
    }

    // Extract Bearer token
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('JWT token extracted successfully');
      // In development, check if this is a mock token
      if (
        process.env.NODE_ENV === 'development' &&
        token.includes('mock-signature-for-development-only')
      ) {
        console.log('🔧 Development mock token detected');
        return token;
      }

      return token;
    }

    console.log('Authorization header does not start with Bearer');
    return null;
  } catch (error) {
    console.error('Error extracting JWT token:', error);
    return null;
  }
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: customJwtExtractor,
      ignoreExpiration: process.env.NODE_ENV === 'development', // Ignore expiration in development
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'fallback-secret-for-dev',
    });
  }

  async validate(payload: any) {
    // In development mode, handle mock tokens with fallback payload
    if (process.env.NODE_ENV === 'development') {
      // If payload is invalid or missing, create a mock user for development
      if (!payload || !payload.sub) {
        console.log('🔧 Creating mock user for invalid development token');
        return {
          id: 'test-shop-id-123',
          phone: '+1234567890',
          type: 'shop',
          role: { name: 'shop_owner', permissions: {} },
          shop: {
            id: 'test-shop-id-123',
            nameAr: 'متجر تجريبي',
            nameFr: 'Test Shop',
            status: 'APPROVED',
            phone: '+1234567890',
          },
        };
      }
    }

    const { sub: id, type } = payload;

    // Handle development mock tokens
    if (process.env.NODE_ENV === 'development' && id === 'test-shop-id-123') {
      console.log('🔧 Using development mock authentication for shop:', id);
      return {
        id: 'test-shop-id-123',
        phone: '+1234567890',
        type: 'shop',
        role: { name: 'shop_owner', permissions: {} },
        shop: {
          id: 'test-shop-id-123',
          nameAr: 'متجر تجريبي',
          nameFr: 'Test Shop',
          status: 'APPROVED',
          phone: '+1234567890',
        },
      };
    }

    if (type === 'shop') {
      const shop = await this.prisma.shop.findUnique({
        where: { id },
        include: {
          createdBy: {
            include: { role: true },
          },
        },
      });

      if (!shop) {
        throw new UnauthorizedException('Shop not found');
      }

      return {
        id: shop.id,
        phone: shop.phone,
        type: 'shop',
        role: { name: 'shop_owner', permissions: {} },
        shop: shop,
      };
    }

    if (type === 'user') {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          role: true,
          commercialAgent: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return {
        id: user.id,
        phone: user.phone,
        type: 'user',
        role: user.role,
        commercialAgent: user.commercialAgent,
      };
    }

    throw new UnauthorizedException('Invalid user type');
  }
}
