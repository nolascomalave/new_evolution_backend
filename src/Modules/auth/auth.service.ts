import { Injectable } from "@nestjs/common";
import { system_subscription_user } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import { hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    hashPassword(password) {
        return hashSync(password, 10);
    }

    async login() {
        const user: system_subscription_user = await this.prisma.system_subscription_user.findFirst({

        });
    }
}