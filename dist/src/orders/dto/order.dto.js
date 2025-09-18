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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatusHistory = exports.OrderAnalytics = exports.TopShop = exports.TopProduct = exports.RevenueByDay = exports.OrderStatusCount = exports.OrderStats = exports.OrderFilters = exports.OrderConnection = exports.UpdateOrderStatusInput = exports.CreateOrderInput = exports.OrderItemInput = exports.Order = exports.OrderShop = exports.OrderItem = exports.OrderProduct = exports.OrderProductImage = exports.OrderPriceTier = exports.OrderBrand = exports.OrderCategory = exports.OrderUser = exports.OrderRole = exports.OrderStatus = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["NEW"] = "NEW";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
(0, graphql_1.registerEnumType)(OrderStatus, {
    name: 'OrderStatus',
});
let OrderRole = class OrderRole {
};
exports.OrderRole = OrderRole;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderRole.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderRole.prototype, "name", void 0);
exports.OrderRole = OrderRole = __decorate([
    (0, graphql_1.ObjectType)()
], OrderRole);
let OrderUser = class OrderUser {
};
exports.OrderUser = OrderUser;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderUser.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderUser.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderUser.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderUser.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderRole, { nullable: true }),
    __metadata("design:type", OrderRole)
], OrderUser.prototype, "role", void 0);
exports.OrderUser = OrderUser = __decorate([
    (0, graphql_1.ObjectType)()
], OrderUser);
let OrderCategory = class OrderCategory {
};
exports.OrderCategory = OrderCategory;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderCategory.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderCategory.prototype, "nameAr", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderCategory.prototype, "nameFr", void 0);
exports.OrderCategory = OrderCategory = __decorate([
    (0, graphql_1.ObjectType)()
], OrderCategory);
let OrderBrand = class OrderBrand {
};
exports.OrderBrand = OrderBrand;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderBrand.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderBrand.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderBrand.prototype, "logoUrl", void 0);
exports.OrderBrand = OrderBrand = __decorate([
    (0, graphql_1.ObjectType)()
], OrderBrand);
let OrderPriceTier = class OrderPriceTier {
};
exports.OrderPriceTier = OrderPriceTier;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderPriceTier.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderPriceTier.prototype, "minQuantity", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderPriceTier.prototype, "pricePerUnit", void 0);
exports.OrderPriceTier = OrderPriceTier = __decorate([
    (0, graphql_1.ObjectType)()
], OrderPriceTier);
let OrderProductImage = class OrderProductImage {
};
exports.OrderProductImage = OrderProductImage;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderProductImage.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderProductImage.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderProductImage.prototype, "sortOrder", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], OrderProductImage.prototype, "isPrimary", void 0);
exports.OrderProductImage = OrderProductImage = __decorate([
    (0, graphql_1.ObjectType)()
], OrderProductImage);
let OrderProduct = class OrderProduct {
};
exports.OrderProduct = OrderProduct;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderProduct.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderProduct.prototype, "sku", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderProduct.prototype, "nameAr", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderProduct.prototype, "nameFr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderProduct.prototype, "descriptionAr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderProduct.prototype, "descriptionFr", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderProduct.prototype, "basePrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderProduct.prototype, "currentStock", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderProductImage], { nullable: true }),
    __metadata("design:type", Array)
], OrderProduct.prototype, "images", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderProductImage], { nullable: true }),
    __metadata("design:type", Array)
], OrderProduct.prototype, "imageDetails", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderCategory, { nullable: true }),
    __metadata("design:type", OrderCategory)
], OrderProduct.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderBrand, { nullable: true }),
    __metadata("design:type", OrderBrand)
], OrderProduct.prototype, "brand", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderPriceTier], { nullable: true }),
    __metadata("design:type", Array)
], OrderProduct.prototype, "priceTiers", void 0);
exports.OrderProduct = OrderProduct = __decorate([
    (0, graphql_1.ObjectType)()
], OrderProduct);
let OrderItem = class OrderItem {
};
exports.OrderItem = OrderItem;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderItem.prototype, "totalPrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderProduct),
    __metadata("design:type", OrderProduct)
], OrderItem.prototype, "product", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, graphql_1.ObjectType)()
], OrderItem);
let OrderShop = class OrderShop {
};
exports.OrderShop = OrderShop;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderShop.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderShop.prototype, "nameAr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderShop.prototype, "nameFr", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderShop.prototype, "ownerName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderShop.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderShop.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderShop.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderShop.prototype, "profileImage", void 0);
exports.OrderShop = OrderShop = __decorate([
    (0, graphql_1.ObjectType)()
], OrderShop);
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderStatus),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Order.prototype, "taxAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Order.prototype, "totalAmount", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "processedAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "deliveredAt", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderShop),
    __metadata("design:type", OrderShop)
], Order.prototype, "shop", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderItem]),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderStatusHistory], { nullable: true }),
    __metadata("design:type", Array)
], Order.prototype, "statusHistory", void 0);
exports.Order = Order = __decorate([
    (0, graphql_1.ObjectType)()
], Order);
let OrderItemInput = class OrderItemInput {
};
exports.OrderItemInput = OrderItemInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OrderItemInput.prototype, "productId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemInput.prototype, "quantity", void 0);
exports.OrderItemInput = OrderItemInput = __decorate([
    (0, graphql_1.InputType)()
], OrderItemInput);
let CreateOrderInput = class CreateOrderInput {
};
exports.CreateOrderInput = CreateOrderInput;
__decorate([
    (0, graphql_1.Field)(() => [OrderItemInput]),
    __metadata("design:type", Array)
], CreateOrderInput.prototype, "items", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrderInput.prototype, "notes", void 0);
exports.CreateOrderInput = CreateOrderInput = __decorate([
    (0, graphql_1.InputType)()
], CreateOrderInput);
let UpdateOrderStatusInput = class UpdateOrderStatusInput {
};
exports.UpdateOrderStatusInput = UpdateOrderStatusInput;
__decorate([
    (0, graphql_1.Field)(() => OrderStatus),
    (0, class_validator_1.IsEnum)(OrderStatus),
    __metadata("design:type", String)
], UpdateOrderStatusInput.prototype, "status", void 0);
exports.UpdateOrderStatusInput = UpdateOrderStatusInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateOrderStatusInput);
let OrderConnection = class OrderConnection {
};
exports.OrderConnection = OrderConnection;
__decorate([
    (0, graphql_1.Field)(() => [Order]),
    __metadata("design:type", Array)
], OrderConnection.prototype, "orders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderConnection.prototype, "total", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderConnection.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderConnection.prototype, "limit", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], OrderConnection.prototype, "hasMore", void 0);
exports.OrderConnection = OrderConnection = __decorate([
    (0, graphql_1.ObjectType)()
], OrderConnection);
let OrderFilters = class OrderFilters {
};
exports.OrderFilters = OrderFilters;
__decorate([
    (0, graphql_1.Field)(() => OrderStatus, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrderStatus),
    __metadata("design:type", String)
], OrderFilters.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilters.prototype, "shopId", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilters.prototype, "dateFrom", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OrderFilters.prototype, "dateTo", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderFilters.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { defaultValue: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderFilters.prototype, "limit", void 0);
exports.OrderFilters = OrderFilters = __decorate([
    (0, graphql_1.InputType)()
], OrderFilters);
let OrderStats = class OrderStats {
};
exports.OrderStats = OrderStats;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderStats.prototype, "totalOrders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderStats.prototype, "pendingOrders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderStats.prototype, "processingOrders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderStats.prototype, "deliveredOrders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderStats.prototype, "totalRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderStats.prototype, "todayRevenue", void 0);
exports.OrderStats = OrderStats = __decorate([
    (0, graphql_1.ObjectType)()
], OrderStats);
let OrderStatusCount = class OrderStatusCount {
};
exports.OrderStatusCount = OrderStatusCount;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], OrderStatusCount.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderStatusCount.prototype, "count", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderStatusCount.prototype, "percentage", void 0);
exports.OrderStatusCount = OrderStatusCount = __decorate([
    (0, graphql_1.ObjectType)()
], OrderStatusCount);
let RevenueByDay = class RevenueByDay {
};
exports.RevenueByDay = RevenueByDay;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RevenueByDay.prototype, "date", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], RevenueByDay.prototype, "revenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RevenueByDay.prototype, "orders", void 0);
exports.RevenueByDay = RevenueByDay = __decorate([
    (0, graphql_1.ObjectType)()
], RevenueByDay);
let TopProduct = class TopProduct {
};
exports.TopProduct = TopProduct;
__decorate([
    (0, graphql_1.Field)(() => OrderProduct),
    __metadata("design:type", OrderProduct)
], TopProduct.prototype, "product", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TopProduct.prototype, "totalSold", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TopProduct.prototype, "revenue", void 0);
exports.TopProduct = TopProduct = __decorate([
    (0, graphql_1.ObjectType)()
], TopProduct);
let TopShop = class TopShop {
};
exports.TopShop = TopShop;
__decorate([
    (0, graphql_1.Field)(() => OrderShop),
    __metadata("design:type", OrderShop)
], TopShop.prototype, "shop", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TopShop.prototype, "totalOrders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TopShop.prototype, "totalRevenue", void 0);
exports.TopShop = TopShop = __decorate([
    (0, graphql_1.ObjectType)()
], TopShop);
let OrderAnalytics = class OrderAnalytics {
};
exports.OrderAnalytics = OrderAnalytics;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderAnalytics.prototype, "totalOrders", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderAnalytics.prototype, "totalRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderAnalytics.prototype, "averageOrderValue", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderStatusCount]),
    __metadata("design:type", Array)
], OrderAnalytics.prototype, "ordersByStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => [RevenueByDay]),
    __metadata("design:type", Array)
], OrderAnalytics.prototype, "revenueByDay", void 0);
__decorate([
    (0, graphql_1.Field)(() => [TopProduct]),
    __metadata("design:type", Array)
], OrderAnalytics.prototype, "topProducts", void 0);
__decorate([
    (0, graphql_1.Field)(() => [TopShop]),
    __metadata("design:type", Array)
], OrderAnalytics.prototype, "topShops", void 0);
exports.OrderAnalytics = OrderAnalytics = __decorate([
    (0, graphql_1.ObjectType)()
], OrderAnalytics);
let OrderStatusHistory = class OrderStatusHistory {
};
exports.OrderStatusHistory = OrderStatusHistory;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderStatus),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], OrderStatusHistory.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], OrderStatusHistory.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => OrderUser),
    __metadata("design:type", OrderUser)
], OrderStatusHistory.prototype, "updatedBy", void 0);
exports.OrderStatusHistory = OrderStatusHistory = __decorate([
    (0, graphql_1.ObjectType)()
], OrderStatusHistory);
//# sourceMappingURL=order.dto.js.map