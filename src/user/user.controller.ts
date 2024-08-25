import { Controller, Get, Post, Body, HttpException, HttpStatus, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto, @Body('role') role: string) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getUsers() {
    return this.userService.getAllUsers();
  }

 /* @Patch('deactivate/:id')
  async deactivateUser(@Param('id') id: string) {
    return this.userService.deactivateUser(id);
  }*/

  @Post('forgot-password')
  async forgotPassword(@Body('identifier') identifier: string) {
    const user = await this.userService.findByIdentifier(identifier);
    if (!user) {
      throw new HttpException('Aucun compte trouvé avec cet identifiant.', HttpStatus.NOT_FOUND);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body('newPassword') newPassword: string, @Body('identifier') identifier: string) {
    const user = await this.userService.findByIdentifier(identifier);
    if (!user) {
      throw new HttpException('Identifiant invalide.', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await this.userService.updateUser(user);
    return { success: 'Votre mot de passe a été réinitialisé avec succès.' };
  }
}