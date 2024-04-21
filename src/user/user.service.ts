import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import { NewUserDto, SpecifiedUserDto, UpdatedUserDto } from './dto/user.dto';
import { UserRo } from './ro/user.ro';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(id: string): Promise<UserRo | void> {
    return this.userModel.findById(id);
  }

  // async createUser(newUserDto: NewUserDto): Promise<UserRo> {

  // }

  // async updateUser(id: string, updatedUserDto: UpdatedUserDto): Promise<UserRo | void> {

  // }

  // async replaceUser(id: string, newUserDto: NewUserDto): Promise<UserRo | void> {

  // }

  // async deleteUser(id: string): Promise<UserRo | void> {

  // }
}
