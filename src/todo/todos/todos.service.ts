import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateTodoDto } from '../dto/update.todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, title: string) {
    const user = await this.usersService.findOneById(userId);

    const todo = this.todosRepository.create({ title, user });

    return this.todosRepository.save(todo);
  }

  async findAllForUser(userId: number) {
    return this.todosRepository.find({
      where: { user: { id: userId } },
    });
  }

  async update(id: number, dto: UpdateTodoDto, userId: number) {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (dto.title !== undefined) {
      todo.title = dto.title;
    }

    if (dto.completed !== undefined) {
      todo.completed = dto.completed;
    }

    return this.todosRepository.save(todo);
  }

  async delete(userId: number, todoId: number) {
    const todo = await this.todosRepository.findOne({
      where: { id: todoId, user: { id: userId } },
    });

    if (!todo) throw new NotFoundException('Todo not found');

    return this.todosRepository.remove(todo);
  }
}
