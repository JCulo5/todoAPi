import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Poslati cijeli loginDto objekt, ne samo email i password
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getProtectedRoute() {
    return { message: 'This is a protected route' };
  }

  //@UseGuards(JwtAuthGuard)
  @Post('logout') // Nova ruta za logout
  logout() {
    //slocalStorage.removeItem('token');
    return { message: 'Logged out successfully' };
  }
}
