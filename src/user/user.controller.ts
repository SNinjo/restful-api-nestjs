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
  getUser(specifiedUserDto: SpecifiedUserDto): Promise<UserRo | void> {
    return this.userService.getUser(specifiedUserDto.id);
  }

  // @Post()
  // createUser(newUserDto: NewUserDto): Promise<UserRo> {
  //   return this.userService.createUser(newUserDto);
  // }

  // @Patch()
  // updateUser(
  //   @Query() specifiedUserDto: SpecifiedUserDto,
  //   @Body() updatedUserDto: UpdatedUserDto,
  // ): Promise<UserRo | void> {
  //   return this.userService.updateUser(specifiedUserDto.id, updatedUserDto);
  // }

  // @Put()
  // replaceUser(
  //   @Query() specifiedUserDto: SpecifiedUserDto,
  //   @Body() newUserDto: NewUserDto,
  // ): Promise<UserRo | void> {
  //   return this.userService.replaceUser(specifiedUserDto.id, newUserDto);
  // }

  // @Delete()
  // deleteUser(specifiedUserDto: SpecifiedUserDto): Promise<UserRo | void> {
  //   return this.userService.deleteUser(specifiedUserDto.id);
  // }
}
