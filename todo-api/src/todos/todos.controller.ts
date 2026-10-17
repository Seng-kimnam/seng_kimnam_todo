import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // 201 + new todo, or 400 (validation)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  // 200 + list of todos
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  // 200 + todo, or 404
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  // 200 + todo, or 404 (and 400 on validation)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  // 204 no content, or 404
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.todosService.remove(id);
  }
}
