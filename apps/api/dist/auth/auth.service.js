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
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    signAccessToken(payload) {
        const secret = process.env.API_JWT_SECRET || 'dev-secret';
        const expiresIn = process.env.API_JWT_EXPIRES || '15m';
        return this.jwt.signAsync(payload, { secret, expiresIn });
    }
    signRefreshToken(payload) {
        const secret = process.env.API_REFRESH_SECRET || 'dev-refresh-secret';
        const expiresIn = process.env.API_REFRESH_EXPIRES || '7d';
        return this.jwt.signAsync(payload, { secret, expiresIn });
    }
    cookieOptions() {
        const secure = (process.env.COOKIE_SECURE || 'false') === 'true';
        return {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };
    }
    async register(email, password, name) {
        const existing = await this.users.findByEmail(email);
        if (existing)
            throw new common_1.UnauthorizedException('Email already exists');
        const user = await this.users.createUser(email, password, name, ['admin']);
        return { id: user.id, email: user.email };
    }
    async validateUser(email, password) {
        const user = await this.users.findByEmail(email);
        if (!user || !user.active)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    async login(email, password, res) {
        const user = await this.validateUser(email, password);
        const payload = { sub: user.id, email: user.email, roles: user.roles };
        const accessToken = await this.signAccessToken(payload);
        const refreshToken = await this.signRefreshToken({ sub: user.id });
        res.cookie('refresh_token', refreshToken, this.cookieOptions());
        return { accessToken };
    }
    async refresh(refreshToken, res) {
        const secret = process.env.API_REFRESH_SECRET || 'dev-refresh-secret';
        try {
            const decoded = await this.jwt.verifyAsync(refreshToken, { secret });
            const user = await this.users.findById(decoded.sub);
            if (!user || !user.active)
                throw new common_1.UnauthorizedException();
            const accessToken = await this.signAccessToken({ sub: user.id, email: user.email, roles: user.roles });
            res.cookie('refresh_token', await this.signRefreshToken({ sub: user.id }), this.cookieOptions());
            return { accessToken };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(res) {
        res.clearCookie('refresh_token', { path: '/auth/refresh' });
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map