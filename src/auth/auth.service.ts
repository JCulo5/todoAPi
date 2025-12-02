import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async login(user: any) {
    const payload = { userId: user.id }; // Payload s korisničkim ID-jem
    const token = this.jwtService.sign(payload); // Generiraj JWT token
    return { message: 'Login successful', token };
  }

  async validateUserByJwt(payload: any) {
    // Validiraj korisnika na temelju njegovog ID-a u payload-u
    return await this.usersService.findOneById(payload.userId);
  }
}
