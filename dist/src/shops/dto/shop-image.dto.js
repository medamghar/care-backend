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
exports.UpdateShopImageInput = exports.CreateShopImageInput = exports.ShopImage = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
let ShopImage = class ShopImage {
};
exports.ShopImage = ShopImage;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ShopImage.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ShopImage.prototype, "shopId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ShopImage.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ShopImage.prototype, "sortOrder", void 0);
exports.ShopImage = ShopImage = __decorate([
    (0, graphql_1.ObjectType)()
], ShopImage);
let CreateShopImageInput = class CreateShopImageInput {
};
exports.CreateShopImageInput = CreateShopImageInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShopImageInput.prototype, "shopId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateShopImageInput.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateShopImageInput.prototype, "sortOrder", void 0);
exports.CreateShopImageInput = CreateShopImageInput = __decorate([
    (0, graphql_1.InputType)()
], CreateShopImageInput);
let UpdateShopImageInput = class UpdateShopImageInput {
};
exports.UpdateShopImageInput = UpdateShopImageInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShopImageInput.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateShopImageInput.prototype, "sortOrder", void 0);
exports.UpdateShopImageInput = UpdateShopImageInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateShopImageInput);
//# sourceMappingURL=shop-image.dto.js.map