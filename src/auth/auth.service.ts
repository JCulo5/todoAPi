import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload);
    return { message: 'Registration successful', token };
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async login(user: any) {
    const payload = { userId: user.id, role: user.role }; // Payload s korisničkim ID-jem i rolom
    const token = this.jwtService.sign(payload); // Generiraj JWT token
    return { message: 'Login successful', token };
  }

  async validateUserByJwt(payload: any) {
    // Validiraj korisnika na temelju njegovog ID-a u payload-u
    return await this.usersService.findOneById(payload.userId);
  }
}
