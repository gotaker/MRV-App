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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const health_controller_1 = require("./controllers/health.controller");
const users_module_1 = require("./users/users.module");
const users_service_1 = require("./users/users.service");
const auth_module_1 = require("./auth/auth.module");
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mrv';
let AppModule = class AppModule {
    constructor(users) {
        this.users = users;
    }
    async onModuleInit() {
        await this.users.ensureAdmin();
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(mongoUri, { serverSelectionTimeoutMS: 5000 }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [],
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AppModule);
//# sourceMappingURL=app.module.js.map