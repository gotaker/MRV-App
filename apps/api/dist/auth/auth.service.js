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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    signAccess(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.API_JWT_SECRET || 'dev-secret',
            expiresIn: process.env.API_JWT_EXPIRES || '15m',
        });
    }
    signRefresh(payload) {
        return this.jwt.signAsync(payload, {
            secret: process.env.API_REFRESH_SECRET || 'dev-refresh',
            expiresIn: process.env.API_REFRESH_EXPIRES || '7d',
        });
    }
    async validateUser(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user || !user.active)
            return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return null;
        return user;
    }
    async login(user) {
        const payload = { sub: user._id.toString(), email: user.email, roles: user.roles };
        const accessToken = await this.signAccess(payload);
        const refreshToken = await this.signRefresh({ sub: payload.sub });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map