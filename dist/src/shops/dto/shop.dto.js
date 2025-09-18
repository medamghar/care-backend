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
exports.CreateShopInput = exports.UpdateShopPasswordInput = exports.UpdateShopInput = exports.Shop = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const shop_image_dto_1 = require("./shop-image.dto");
(0, graphql_1.registerEnumType)(client_1.ShopStatus, {
    name: 'ShopStatus',
    description: 'Shop status enum',
});
let Shop = class Shop {
};
exports.Shop = Shop;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Shop.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Shop.prototype, "nameAr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Shop.prototype, "nameFr", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Shop.prototype, "ownerName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Shop.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Shop.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Shop.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Shop.prototype, "latitude", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Shop.prototype, "longitude", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Shop.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Shop.prototype, "profileImage", void 0);
__decorate([
    (0, graphql_1.Field)(() => [shop_image_dto_1.ShopImage], { nullable: true }),
    __metadata("design:type", Array)
], Shop.prototype, "shopImages", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Shop.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Shop.prototype, "updatedAt", void 0);
exports.Shop = Shop = __decorate([
    (0, graphql_1.ObjectType)()
], Shop);
let UpdateShopInput = class UpdateShopInput {
};
exports.UpdateShopInput = UpdateShopInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم المتجر لا يمكن أن يكون فارغاً' }),
    __metadata("design:type", String)
], UpdateShopInput.prototype, "nameAr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShopInput.prototype, "nameFr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم المالك لا يمكن أن يكون فارغاً' }),
    __metadata("design:type", String)
], UpdateShopInput.prototype, "ownerName", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'المدينة لا يمكن أن تكون فارغة' }),
    __metadata("design:type", String)
], UpdateShopInput.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'العنوان لا يمكن أن يكون فارغاً' }),
    __metadata("design:type", String)
], UpdateShopInput.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'خط العرض يجب أن يكون رقماً صحيحاً' }),
    __metadata("design:type", Number)
], UpdateShopInput.prototype, "latitude", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'خط الطول يجب أن يكون رقماً صحيحاً' }),
    __metadata("design:type", Number)
], UpdateShopInput.prototype, "longitude", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShopInput.prototype, "profileImage", void 0);
exports.UpdateShopInput = UpdateShopInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateShopInput);
let UpdateShopPasswordInput = class UpdateShopPasswordInput {
};
exports.UpdateShopPasswordInput = UpdateShopPasswordInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateShopPasswordInput.prototype, "oldPassword", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateShopPasswordInput.prototype, "newPassword", void 0);
exports.UpdateShopPasswordInput = UpdateShopPasswordInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateShopPasswordInput);
let CreateShopInput = class CreateShopInput {
};
exports.CreateShopInput = CreateShopInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم المتجر لا يمكن أن يكون فارغاً' }),
    __metadata("design:type", String)
], CreateShopInput.prototype, "nameAr", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShopInput.prototype, "nameFr", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'اسم المالك لا يمكن أن يكون فارغاً' }),
    __metadata("design:type", String)
], CreateShopInput.prototype, "ownerName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'رقم الهاتف مطلوب' }),
    __metadata("design:type", String)
], CreateShopInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'كلمة المرور مطلوبة' }),
    __metadata("design:type", String)
], CreateShopInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'المدينة لا يمكن أن تكون فارغة' }),
    __metadata("design:type", String)
], CreateShopInput.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'العنوان لا يمكن أن يكون فارغاً' }),
    __metadata("design:type", String)
], CreateShopInput.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'خط العرض يجب أن يكون رقماً صحيحاً' }),
    __metadata("design:type", Number)
], CreateShopInput.prototype, "latitude", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'خط الطول يجب أن يكون رقماً صحيحاً' }),
    __metadata("design:type", Number)
], CreateShopInput.prototype, "longitude", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShopInput.prototype, "profileImage", void 0);
exports.CreateShopInput = CreateShopInput = __decorate([
    (0, graphql_1.InputType)()
], CreateShopInput);
//# sourceMappingURL=shop.dto.js.map