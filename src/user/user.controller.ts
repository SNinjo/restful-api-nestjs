import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { NewUserDto, SpecifiedUserDto, UpdatedUserDto } from './dto/user.dto';
import { UserRo } from './ro/user.ro';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@Query() specifiedUserDto: SpecifiedUserDto): Promise<UserRo> {
    return this.userService.getUser(specifiedUserDto.id);
  }

  @Post()
  createUser(@Query() newUserDto: NewUserDto): Promise<UserRo> {
    return this.userService.createUser(newUserDto);
  }

  @Patch()
  updateUser(
    @Query() specifiedUserDto: SpecifiedUserDto,
    @Body() updatedUserDto: UpdatedUserDto,
  ): Promise<UserRo> {
    return this.userService.updateUser(specifiedUserDto.id, updatedUserDto);
  }

  @Put()
  replaceUser(
    @Query() specifiedUserDto: SpecifiedUserDto,
    @Body() newUserDto: NewUserDto,
  ): Promise<UserRo> {
    return this.userService.updateUser(specifiedUserDto.id, newUserDto);
  }

  @Delete()
  deleteUser(@Query() specifiedUserDto: SpecifiedUserDto): Promise<UserRo> {
    return this.userService.deleteUser(specifiedUserDto.id);
  }
}
