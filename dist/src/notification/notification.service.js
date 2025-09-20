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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pubservice_service_1 = require("../pubservice/pubservice.service");
let NotificationService = class NotificationService {
    constructor(prisma, pubSubService) {
        this.prisma = prisma;
        this.pubSubService = pubSubService;
    }
    async findMyNotifications(userId) {
        return this.prisma.notification.findMany({
            where: { OR: [
                    { shopId: userId },
                    { shopId: null }
                ] },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markAsRead(id, userId) {
        return this.prisma.notification.update({
            where: { id, shopId: userId },
            data: { isRead: true },
        });
    }
    async createBroadcastNotification(message, route, title, url) {
        const notifications = await this.prisma.notification.create({ data: {
                message,
                route,
                imageUrl: url,
                title
            } });
        console.log('ddddddddddddddddddddddddddddddddd', notifications);
        if (notifications) {
            console.log(notifications);
            await this.pubSubService.publish(`broadcastNotification`, { broadcastNotification: notifications });
        }
        return notifications;
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, pubservice_service_1.PubserviceService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map