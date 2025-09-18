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
exports.UpdateSliderInput = exports.CreateSliderInput = exports.Slider = exports.UpdatePromotionInput = exports.CreatePromotionInput = exports.Promotion = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
(0, graphql_1.registerEnumType)(client_1.PromotionType, {
    name: 'PromotionType',
});
let Promotion = class Promotion {
};
exports.Promotion = Promotion;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Promotion.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PromotionType),
    __metadata("design:type", String)
], Promotion.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Promotion.prototype, "value", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Promotion.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Promotion.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Promotion.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Promotion.prototype, "createdAt", void 0);
exports.Promotion = Promotion = __decorate([
    (0, graphql_1.ObjectType)()
], Promotion);
let CreatePromotionInput = class CreatePromotionInput {
};
exports.CreatePromotionInput = CreatePromotionInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromotionInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PromotionType),
    (0, class_validator_1.IsEnum)(client_1.PromotionType),
    __metadata("design:type", String)
], CreatePromotionInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePromotionInput.prototype, "value", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePromotionInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePromotionInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePromotionInput.prototype, "isActive", void 0);
exports.CreatePromotionInput = CreatePromotionInput = __decorate([
    (0, graphql_1.InputType)()
], CreatePromotionInput);
let UpdatePromotionInput = class UpdatePromotionInput {
};
exports.UpdatePromotionInput = UpdatePromotionInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePromotionInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.PromotionType, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PromotionType),
    __metadata("design:type", String)
], UpdatePromotionInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdatePromotionInput.prototype, "value", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePromotionInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePromotionInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePromotionInput.prototype, "isActive", void 0);
exports.UpdatePromotionInput = UpdatePromotionInput = __decorate([
    (0, graphql_1.InputType)()
], UpdatePromotionInput);
let Slider = class Slider {
};
exports.Slider = Slider;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Slider.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Slider.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Slider.prototype, "linkUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Slider.prototype, "sortOrder", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], Slider.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Slider.prototype, "createdAt", void 0);
exports.Slider = Slider = __decorate([
    (0, graphql_1.ObjectType)()
], Slider);
let CreateSliderInput = class CreateSliderInput {
};
exports.CreateSliderInput = CreateSliderInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSliderInput.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSliderInput.prototype, "linkUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSliderInput.prototype, "sortOrder", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSliderInput.prototype, "isActive", void 0);
exports.CreateSliderInput = CreateSliderInput = __decorate([
    (0, graphql_1.InputType)()
], CreateSliderInput);
let UpdateSliderInput = class UpdateSliderInput {
};
exports.UpdateSliderInput = UpdateSliderInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSliderInput.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSliderInput.prototype, "linkUrl", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSliderInput.prototype, "sortOrder", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSliderInput.prototype, "isActive", void 0);
exports.UpdateSliderInput = UpdateSliderInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateSliderInput);
//# sourceMappingURL=promotion.dto.js.map