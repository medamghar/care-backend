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
exports.NotificationResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const notification_service_1 = require("./notification.service");
const notification_entity_1 = require("./notification.entity");
const pubservice_service_1 = require("../pubservice/pubservice.service");
const orders_service_1 = require("../orders/orders.service");
let NotificationResolver = class NotificationResolver {
    constructor(notificationService, pubSubService, orderService) {
        this.notificationService = notificationService;
        this.pubSubService = pubSubService;
        this.orderService = orderService;
    }
    async myNotifications(context) {
        const user = context.req.user;
        console.log(user);
        return this.notificationService.findMyNotifications("cmfn4lmkr001mt4xs3y3da67w");
    }
    async createBroadcastNotification(message, route, title, url) {
        const notification = await this.notificationService.createBroadcastNotification(message, route, title, url);
        return notification;
    }
    async markNotificationAsRead(id, context) {
        const shopId = context.req.user.id;
        return this.notificationService.markAsRead(id, shopId);
    }
    async broadcastNotification() {
        return this.pubSubService.asyncIterator('broadcastNotification');
    }
};
exports.NotificationResolver = NotificationResolver;
__decorate([
    (0, graphql_1.Query)(() => [notification_entity_1.Notification]),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "myNotifications", null);
__decorate([
    (0, graphql_1.Mutation)(() => notification_entity_1.Notification),
    __param(0, (0, graphql_1.Args)('message')),
    __param(1, (0, graphql_1.Args)('route')),
    __param(2, (0, graphql_1.Args)('title')),
    __param(3, (0, graphql_1.Args)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "createBroadcastNotification", null);
__decorate([
    (0, graphql_1.Mutation)(() => notification_entity_1.Notification),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "markNotificationAsRead", null);
__decorate([
    (0, graphql_1.Subscription)(() => notification_entity_1.Notification, {
        filter: (payload) => {
            console.log('Subscription filter payload:', payload);
            return Boolean(payload.broadcastNotification);
        },
        resolve: (payload) => {
            console.log('Resolving payload:', payload);
            return payload.broadcastNotification;
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificationResolver.prototype, "broadcastNotification", null);
exports.NotificationResolver = NotificationResolver = __decorate([
    (0, graphql_1.Resolver)(() => notification_entity_1.Notification),
    __metadata("design:paramtypes", [notification_service_1.NotificationService, pubservice_service_1.PubserviceService, orders_service_1.OrdersService])
], NotificationResolver);
//# sourceMappingURL=notification.resolver.js.map