import { ExecutionContext } from '@nestjs/common';
declare const ShopJwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class ShopJwtAuthGuard extends ShopJwtAuthGuard_base {
    getRequest(context: ExecutionContext): any;
    handleRequest(err: any, user: any, info: any, context: ExecutionContext): any;
}
export {};
