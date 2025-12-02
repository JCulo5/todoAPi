import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateTodoDto } from '../dto/update.todo.dto';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  create(@Req() req, @Body('title') title: string) {
    return this.todosService.create(req.user.id, title);
  }

  @Get()
  getAll(@Req() req) {
    return this.todosService.findAllForUser(req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTodoDto, @Request() req) {
    return this.todosService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: number) {
    return this.todosService.delete(req.user.userId, id);
  }
}
