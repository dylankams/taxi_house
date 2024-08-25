import { Controller, Post, Body, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  //@UseGuards(JwtAuthGuard)
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    this.logger.log('Login request received');
    
    const user = await this.authService.validateUser(authCredentialsDto);
    
    if (!user) {
      this.logger.warn('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User found: ${user.username}`);
    const result = await this.authService.login(user);
    
    this.logger.log('User authenticated successfully');
    return result;
  }
}
