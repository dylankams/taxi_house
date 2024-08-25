// user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository'; // Assurez-vous d'importer UserRepository
import { RoleRepository } from './role.repository'; // Assurez-vous d'importer RoleRepository
import { User } from './entities/user.entity'; // Assurez-vous d'importer l'entité User
import { Role } from './entities/role.entity'; // Assurez-vous d'importer l'entité Role

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]), // Importez les entités User et Role dans le module TypeOrm
  ],
  controllers: [UserController], // Déclarer le contrôleur ici s'il est nécessaire
  providers: [UserService, UserRepository, RoleRepository], // Déclarer le service et les repositories ici
  exports: [UserService,UserRepository], // Exportez le service si nécessaire
})
export class UserModule {}

