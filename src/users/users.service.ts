import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hash } from 'argon2';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await hash(createUserDto.password);
      return await this.prismaService.user.create({ data: { ...createUserDto, password: hashedPassword } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
    }
  }

  async findAll() {
    const users = await this.prismaService.user.findMany();
    if (users.length === 0) throw new NotFoundException('Users are not found.');
    return users;
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id }
    });
    if (!user) throw new NotFoundException('User is not found');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email }
    });
    if (!user) throw new NotFoundException('User is not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: updateUserDto
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('User is not found');
        }

        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.user.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2001') {
          throw new NotFoundException('User is not found');
        }
      }
    }
  }
}


'P2001'