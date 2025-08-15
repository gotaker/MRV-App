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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const express_1 = require("express");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("../common/dto/login.dto");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_guard_1 = require("./jwt.guard");
const jwt_1 = require("@nestjs/jwt");
let AuthController = class AuthController {
    constructor(auth, users, jwt) {
        this.auth = auth;
        this.users = users;
        this.jwt = jwt;
    }
    async register(body) {
        const passwordHash = await bcrypt.hash(body.password, 10);
        const user = await this.users.create({
            email: body.email,
            name: body.name,
            passwordHash,
            roles: ['admin'],
            active: true,
        });
        return { id: user._id, email: user.email };
    }
    async login(body, res) {
        const user = await this.auth.validateUser(body.email, body.password);
        if (!user)
            throw new Error('Invalid credentials');
        const { accessToken, refreshToken } = await this.auth.login(user);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 3600 * 1000,
            path: '/auth/refresh',
        });
        return { accessToken };
    }
    async refresh(req) {
        const token = req.cookies?.['refresh_token'];
        if (!token)
            throw new Error('No refresh token');
        const payload = await this.jwt.verifyAsync(token, {
            secret: process.env.API_REFRESH_SECRET || 'dev-refresh',
        });
        const accessToken = await this.jwt.signAsync({ sub: payload.sub }, { secret: process.env.API_JWT_SECRET || 'dev-secret', expiresIn: process.env.API_JWT_EXPIRES || '15m' });
        return { accessToken };
    }
    async logout(res) {
        res.clearCookie('refresh_token', { path: '/auth/refresh' });
        return { ok: true };
    }
    async me(req) {
        return req.user;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map