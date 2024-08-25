import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    return await this.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({ where: { id } });

    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Check if password needs to be updated
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
      user.password = hashedPassword;
    }

    // Update other fields if provided
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    if (updateUserDto.isActive !== undefined) {
      user.isActive = updateUserDto.isActive;
    }

    // Save the updated user entity
    await this.save(user);

    return user;
  }


  async findUserByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }

  async findUserById(id: number): Promise<User> {
    return this.findOne({ where: { id } });
  }

  async deactivateUser(id: number): Promise<UpdateResult> {
    return this.update(id, { isActive: false });
  }

  async activateUser(id: number): Promise<UpdateResult> {
    return this.update(id, { isActive: true });
  }
}
