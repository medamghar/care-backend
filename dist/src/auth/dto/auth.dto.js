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
exports.UpdateProfileInput = exports.UpdatePasswordInput = exports.AuthPayload = exports.AuthUser = exports.Role = exports.RegisterShopInput = exports.LoginInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = require("graphql-type-json");
const commercial_agent_dto_1 = require("../../users/dto/commercial-agent.dto");
let LoginInput = class LoginInput {
};
exports.LoginInput = LoginInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
exports.LoginInput = LoginInput = __decorate([
    (0, graphql_1.InputType)()
], LoginInput);
let RegisterShopInput = class RegisterShopInput {
};
exports.RegisterShopInput = RegisterShopInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterShopInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterShopInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterShopInput.prototype, "shopName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterShopInput.prototype, "ownerName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterShopInput.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterShopInput.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterShopInput.prototype, "latitude", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterShopInput.prototype, "longitude", void 0);
exports.RegisterShopInput = RegisterShopInput = __decorate([
    (0, graphql_1.InputType)()
], RegisterShopInput);
let Role = class Role {
};
exports.Role = Role;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Role.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_type_json_1.default),
    __metadata("design:type", Object)
], Role.prototype, "permissions", void 0);
exports.Role = Role = __decorate([
    (0, graphql_1.ObjectType)()
], Role);
let AuthUser = class AuthUser {
};
exports.AuthUser = AuthUser;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthUser.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthUser.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthUser.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => Role),
    __metadata("design:type", Role)
], AuthUser.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(() => commercial_agent_dto_1.CommercialAgent, { nullable: true }),
    __metadata("design:type", commercial_agent_dto_1.CommercialAgent)
], AuthUser.prototype, "commercialAgent", void 0);
exports.AuthUser = AuthUser = __decorate([
    (0, graphql_1.ObjectType)()
], AuthUser);
let AuthPayload = class AuthPayload {
};
exports.AuthPayload = AuthPayload;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "accessToken", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "refreshToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => AuthUser),
    __metadata("design:type", AuthUser)
], AuthPayload.prototype, "user", void 0);
exports.AuthPayload = AuthPayload = __decorate([
    (0, graphql_1.ObjectType)()
], AuthPayload);
let UpdatePasswordInput = class UpdatePasswordInput {
};
exports.UpdatePasswordInput = UpdatePasswordInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePasswordInput.prototype, "oldPassword", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePasswordInput.prototype, "newPassword", void 0);
exports.UpdatePasswordInput = UpdatePasswordInput = __decorate([
    (0, graphql_1.InputType)()
], UpdatePasswordInput);
let UpdateProfileInput = class UpdateProfileInput {
};
exports.UpdateProfileInput = UpdateProfileInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileInput.prototype, "phone", void 0);
exports.UpdateProfileInput = UpdateProfileInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateProfileInput);
//# sourceMappingURL=auth.dto.js.map