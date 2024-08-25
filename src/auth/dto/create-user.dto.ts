export class CreateUserDto {
    username: string;
    password: string;
    phoneNumber: string;
    readonly isActive: boolean;
    role: string;
  }  