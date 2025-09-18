"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const graphql_1 = require("@nestjs/graphql");
let ShopJwtAuthGuard = class ShopJwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    getRequest(context) {
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const gqlContext = ctx.getContext();
        const req = gqlContext.req;
        console.log('=== SHOP JWT AUTH GUARD - GET REQUEST ===');
        const isWebSocket = !!gqlContext.connection || !!gqlContext.connectionParams;
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
            if (req && req.headers) {
                console.log('✅ Using request from GraphQL context');
                console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
                return req;
            }
            console.log('⚠️ Unexpected: No request object in WebSocket context');
            return {
                headers: {},
                user: null,
            };
        }
        console.log('🌐 HTTP request detected');
        console.log('Request object:', req ? 'Present' : 'Missing');
        if (!req) {
            console.log('❌ No request object found - this should not happen for HTTP requests');
            return {
                headers: {},
                user: null,
            };
        }
        console.log('Request headers:', req.headers ? 'Present' : 'Missing');
        console.log('Authorization header:', req.headers?.authorization ? 'Present' : 'Missing');
        if (!req.headers) {
            console.log('❌ Request headers are undefined - adding empty headers');
            req.headers = {};
        }
        return req;
    }
    handleRequest(err, user, info, context) {
        console.log('=== SHOP JWT AUTH GUARD - HANDLE REQUEST ===');
        console.log('Error:', err);
        console.log('User from JWT:', JSON.stringify(user, null, 2));
        console.log('Info:', info);
        const authenticatedUser = super.handleRequest(err, user, info, context);
        console.log('Authenticated user after parent handleRequest:', JSON.stringify(authenticatedUser, null, 2));
        if (!authenticatedUser) {
            console.log('ERROR: No authenticated user');
            throw new common_1.UnauthorizedException('Authentication required');
        }
        console.log('User type:', authenticatedUser.type);
        if (authenticatedUser.type !== 'shop') {
            console.log('ERROR: User is not a shop, type:', authenticatedUser.type);
            throw new common_1.UnauthorizedException('Access denied: Shop authentication required');
        }
        console.log('Shop status:', authenticatedUser.shop?.status);
        if (authenticatedUser.shop &&
            authenticatedUser.shop.status !== 'APPROVED') {
            console.log('ERROR: Shop not approved, status:', authenticatedUser.shop.status);
            throw new common_1.UnauthorizedException('Access denied: Shop not approved');
        }
        console.log('SUCCESS: Shop authentication passed');
        return authenticatedUser;
    }
};
exports.ShopJwtAuthGuard = ShopJwtAuthGuard;
exports.ShopJwtAuthGuard = ShopJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], ShopJwtAuthGuard);
//# sourceMappingURL=shop-jwt-auth.guard.js.map