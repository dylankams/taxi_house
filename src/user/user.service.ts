import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;

    const userRole = await this.roleRepository.findOne({ where: { name: role } });
    if (!userRole) {
      throw new Error('Role not found');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: userRole,
    });

    await this.userRepository.save(user);
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username }, relations: ['role'] });
  }

  async findByIdentifier(identifier: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { username: identifier }],
      relations: ['role'],
    });
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }
}