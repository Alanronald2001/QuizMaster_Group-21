import type { User } from '@prisma/client';
import prisma from '../config/database';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Role } = require('@prisma/client');
export interface IUserRepository {
    create(data: { username: string; email: string; password: string; role?: typeof Role }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
    async create(data: { username: string; email: string; password: string; role?: typeof Role }): Promise<User> {
        return prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role || Role.STUDENT,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findByUsername(username: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { username },
        });
    }

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}
