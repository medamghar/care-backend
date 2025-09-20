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
var PubserviceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubserviceService = void 0;
const common_1 = require("@nestjs/common");
const graphql_subscriptions_1 = require("graphql-subscriptions");
let PubserviceService = PubserviceService_1 = class PubserviceService {
    constructor() {
        console.log('[PubserviceService] Using static shared PubSub instance');
    }
    async publish(triggerName, payload) {
        console.log(`[PubserviceService SHARED] Publishing to trigger: "${triggerName}"`);
        console.log(`[PubserviceService SHARED] Payload:`, JSON.stringify(payload, null, 2));
        try {
            const result = await PubserviceService_1.sharedPubSub.publish(triggerName, payload);
            console.log(`[PubserviceService SHARED] Published successfully, ${result} subscribers notified`);
            return result;
        }
        catch (error) {
            console.error(`[PubserviceService SHARED] Error publishing:`, error);
            throw error;
        }
    }
    asyncIterator(triggerName) {
        console.log(`[PubserviceService SHARED] Creating async iterator for trigger: "${triggerName}"`);
        const iterator = PubserviceService_1.sharedPubSub.asyncIterator(triggerName);
        console.log(`[PubserviceService SHARED] Iterator created successfully`);
        return iterator;
    }
};
exports.PubserviceService = PubserviceService;
PubserviceService.sharedPubSub = new graphql_subscriptions_1.PubSub();
exports.PubserviceService = PubserviceService = PubserviceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PubserviceService);
//# sourceMappingURL=pubservice.service.js.map