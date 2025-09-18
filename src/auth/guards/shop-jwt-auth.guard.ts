import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ShopJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const req = gqlContext.req;

    console.log('=== SHOP JWT AUTH GUARD - GET REQUEST ===');

    // Check if this is a WebSocket connection (subscription)
    const isWebSocket =
      !!gqlContext.connection || !!gqlContext.connectionParams;
    console.log('Context type:', isWebSocket ? 'WebSocket' : 'HTTP');
    console.log('Context details:', {
      hasConnection: !!gqlContext.connection,
      hasConnectionParams: !!gqlContext.connectionParams,
      reqType: req ? typeof req : 'undefined',
      reqKeys: req ? Object.keys(req).slice(0, 5) : 'No req',
    });

    if (isWebSocket) {
      console.log('🔌 WebSocket connection detected');
      console.log('Request from context:', req ? 'Present' : 'Missing');
      console.log('Request headers:', req?.headers);

      // The GraphQL context should now provide a properly structured request object
      if (req && req.headers) {
        console.log('✅ Using request from GraphQL context');
        console.log(
          'Authorization header:',
          req.headers.authorization ? 'Present' : 'Missing',
        );
        return req;
      }

      // This should not happen with the updated context, but keep as fallback
      console.log('⚠️ Unexpected: No request object in WebSocket context');
      return {
        headers: {},
        user: null,
      };
    }

    // For HTTP requests
    console.log('🌐 HTTP request detected');
    console.log('Request object:', req ? 'Present' : 'Missing');

    if (!req) {
      console.log(
        '❌ No request object found - this should not happen for HTTP requests',
      );
      return {
        headers: {},
        user: null,
      };
    }

    console.log('Request headers:', req.headers ? 'Present' : 'Missing');
    console.log(
      'Authorization header:',
      req.headers?.authorization ? 'Present' : 'Missing',
    );

    // Ensure headers exist
    if (!req.headers) {
      console.log('❌ Request headers are undefined - adding empty headers');
      req.headers = {};
    }

    return req;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('=== SHOP JWT AUTH GUARD - HANDLE REQUEST ===');
    console.log('Error:', err);
    console.log('User from JWT:', JSON.stringify(user, null, 2));
    console.log('Info:', info);

    // Call the parent handleRequest first to get the authenticated user
    const authenticatedUser = super.handleRequest(err, user, info, context);

    console.log(
      'Authenticated user after parent handleRequest:',
      JSON.stringify(authenticatedUser, null, 2),
    );

    if (!authenticatedUser) {
      console.log('ERROR: No authenticated user');
      throw new UnauthorizedException('Authentication required');
    }

    // Check if the user is a shop
    console.log('User type:', authenticatedUser.type);
    if (authenticatedUser.type !== 'shop') {
      console.log('ERROR: User is not a shop, type:', authenticatedUser.type);
      throw new UnauthorizedException(
        'Access denied: Shop authentication required',
      );
    }

    // Additional validation for shop status
    console.log('Shop status:', authenticatedUser.shop?.status);
    if (
      authenticatedUser.shop &&
      authenticatedUser.shop.status !== 'APPROVED'
    ) {
      console.log(
        'ERROR: Shop not approved, status:',
        authenticatedUser.shop.status,
      );
      throw new UnauthorizedException('Access denied: Shop not approved');
    }

    console.log('SUCCESS: Shop authentication passed');
    return authenticatedUser;
  }
}
