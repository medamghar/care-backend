"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProductResolver = exports.OrdersResolver = exports.OrderNotification = exports.CartCalculationResult = exports.CartItem = exports.CartItemInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const shop_jwt_auth_guard_1 = require("../auth/guards/shop-jwt-auth.guard");
const order_dto_1 = require("./dto/order.dto");
const pubservice_service_1 = require("../pubservice/pubservice.service");
let CartItemInput = class CartItemInput {
};
exports.CartItemInput = CartItemInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CartItemInput.prototype, "productId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CartItemInput.prototype, "quantity", void 0);
exports.CartItemInput = CartItemInput = __decorate([
    (0, graphql_1.InputType)()
], CartItemInput);
let CartItem = class CartItem {
};
exports.CartItem = CartItem;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CartItem.prototype, "productId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CartItem.prototype, "total", void 0);
exports.CartItem = CartItem = __decorate([
    (0, graphql_1.ObjectType)()
], CartItem);
let CartCalculationResult = class CartCalculationResult {
};
exports.CartCalculationResult = CartCalculationResult;
__decorate([
    (0, graphql_1.Field)(() => [CartItem]),
    __metadata("design:type", Array)
], CartCalculationResult.prototype, "items", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CartCalculationResult.prototype, "total", void 0);
exports.CartCalculationResult = CartCalculationResult = __decorate([
    (0, graphql_1.ObjectType)()
], CartCalculationResult);
let OrderNotification = class OrderNotification {
};
exports.OrderNotification = OrderNotification;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderNotification.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderNotification.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderNotification.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderNotification.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderNotification.prototype, "route", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], OrderNotification.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], OrderNotification.prototype, "isRead", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], OrderNotification.prototype, "userId", void 0);
exports.OrderNotification = OrderNotification = __decorate([
    (0, graphql_1.ObjectType)()
], OrderNotification);
let OrdersResolver = class OrdersResolver {
    constructor(ordersService, pubSubService) {
        this.ordersService = ordersService;
        this.pubSubService = pubSubService;
    }
    async createOrder(input, context) {
        try {
            console.log('=== CREATE ORDER DEBUG ===');
            console.log('Context req user:', JSON.stringify(context.req?.user, null, 2));
            console.log('Input:', JSON.stringify(input, null, 2));
            const user = context.req.user;
            if (!user) {
                console.log('ERROR: No user in context');
                throw new Error('User not authenticated');
            }
            const shopId = user.id;
            console.log('User type:', user.type);
            console.log('Shop ID:', shopId);
            console.log('Calling ordersService.createOrder with shopId:', shopId);
            const result = await this.ordersService.createOrder(shopId, input);
            console.log('Order created successfully with ID:', result?.id);
            return result;
        }
        catch (error) {
            console.log('=== CREATE ORDER ERROR ===');
            console.log('Error:', error);
            console.log('Error message:', error.message);
            console.log('Error stack:', error.stack);
            throw error;
        }
    }
    async cancelOrder(id, context) {
        const user = context.req.user;
        return this.ordersService.cancelOrder(id, user.id, user.type);
    }
    async reorderFromPrevious(originalOrderId, context) {
        const user = context.req.user;
        const shopId = user.id;
        return this.ordersService.reorderFromPreviousOrder(originalOrderId, shopId);
    }
    async updateOrderStatus(id, input) {
        return this.ordersService.updateOrderStatus(id, input);
    }
    async order(id, context) {
        const user = context.req.user;
        return this.ordersService.getOrder(id, user.id, user.type);
    }
    async orders(filters, context) {
        const user = context.req.user;
        return this.ordersService.getOrders(filters || {}, user.id, user.type);
    }
    async myOrders(status, context) {
        const user = context.req.user;
        const shopId = user.id;
        return this.ordersService.getShopOrders(shopId, status);
    }
    async orderStats() {
        return this.ordersService.getOrderStats();
    }
    async orderAnalytics(period) {
        return this.ordersService.getOrderAnalytics(period);
    }
    async calculateCartTotal(items) {
        return this.ordersService.calculateCartTotal(items);
    }
    userNotification(userId) {
        return this.pubSubService.asyncIterator(`userNotification_${userId}`);
    }
};
exports.OrdersResolver = OrdersResolver;
__decorate([
    (0, common_1.UseGuards)(shop_jwt_auth_guard_1.ShopJwtAuthGuard),
    (0, graphql_1.Mutation)(() => order_dto_1.Order),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.CreateOrderInput, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)(shop_jwt_auth_guard_1.ShopJwtAuthGuard),
    (0, graphql_1.Mutation)(() => order_dto_1.Order),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.UseGuards)(shop_jwt_auth_guard_1.ShopJwtAuthGuard),
    (0, graphql_1.Mutation)(() => order_dto_1.Order),
    __param(0, (0, graphql_1.Args)('originalOrderId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "reorderFromPrevious", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => order_dto_1.Order),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderStatusInput]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => order_dto_1.Order),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "order", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => order_dto_1.OrderConnection),
    __param(0, (0, graphql_1.Args)('filters', { nullable: true })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.OrderFilters, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "orders", null);
__decorate([
    (0, common_1.UseGuards)(shop_jwt_auth_guard_1.ShopJwtAuthGuard),
    (0, graphql_1.Query)(() => [order_dto_1.Order]),
    __param(0, (0, graphql_1.Args)('status', { type: () => order_dto_1.OrderStatus, nullable: true })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "myOrders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => order_dto_1.OrderStats),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "orderStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Query)(() => order_dto_1.OrderAnalytics),
    __param(0, (0, graphql_1.Args)('period', { defaultValue: 'month' })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "orderAnalytics", null);
__decorate([
    (0, graphql_1.Query)(() => CartCalculationResult, { name: 'calculateCartTotal' }),
    __param(0, (0, graphql_1.Args)('items', { type: () => [CartItemInput] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "calculateCartTotal", null);
__decorate([
    (0, common_1.UseGuards)(shop_jwt_auth_guard_1.ShopJwtAuthGuard),
    (0, graphql_1.Subscription)(() => OrderNotification, {
        filter: (payload, variables) => {
            return payload.userNotification.userId === variables.userId;
        }
    }),
    __param(0, (0, graphql_1.Args)("userId", { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersResolver.prototype, "userNotification", null);
exports.OrdersResolver = OrdersResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_dto_1.Order),
    __metadata("design:paramtypes", [orders_service_1.OrdersService, pubservice_service_1.PubserviceService])
], OrdersResolver);
let OrderProductResolver = class OrderProductResolver {
    async imageDetails(product) {
        return product.images || [];
    }
};
exports.OrderProductResolver = OrderProductResolver;
__decorate([
    (0, graphql_1.ResolveField)(() => [order_dto_1.OrderProductImage], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.OrderProduct]),
    __metadata("design:returntype", Promise)
], OrderProductResolver.prototype, "imageDetails", null);
exports.OrderProductResolver = OrderProductResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_dto_1.OrderProduct)
], OrderProductResolver);
//# sourceMappingURL=orders.resolver.js.map