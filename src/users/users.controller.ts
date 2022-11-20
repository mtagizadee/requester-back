import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    users.forEach(user => delete user.password);
    return users;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    delete user.password;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@GetUser('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    delete user.password;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@GetUser('id') id: number) {
    const user = await this.usersService.remove(id);

    delete user.password;
    return user;
  }
}
