import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, UpdateUserInput } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      include: {
        role: true,
        commercialAgent: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        commercialAgent: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
        commercialAgent: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as any;
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        commercialAgent: true,
      },
    }) as any;
  }

  async findAllRoles() {
    return this.prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },
    }) as any;
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.prisma.user.create({
      data: {
        phone: input.phone,
        passwordHash: hashedPassword,
        roleId: input.roleId,
        isActive: input.isActive,
      },
      include: {
        role: true,
        commercialAgent: true,
      },
    }) as any;
  }

  async update(id: string, input: UpdateUserInput) {
    const updateData: any = { ...input };

    if (input.password) {
      updateData.passwordHash = await bcrypt.hash(input.password, 10);
      delete updateData.password;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true,
        commercialAgent: true,
      },
    }) as any;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
