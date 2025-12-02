import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // 1. Provjera postoji li korisnik
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hashiranje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Kreiranje korisnika
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    // 4. Spremanje
    return this.userRepository.save(newUser);
  }

  //Findbyemail
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  // Metoda za traženje korisnika po ID-u
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  //find All
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ select: ['email'] });
  }

  //find by email

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return user;
  }

  //Pathc user
  async update(id: number, attrs: Partial<CreateUserDto>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (attrs.password) {
      attrs.password = await bcrypt.hash(attrs.password, 10);
    }
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  //Delete user
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.remove(user);
  }
}
