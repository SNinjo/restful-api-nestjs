import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { NewUserDto, UpdatedUserDto } from './dto/user.dto';
import { NOT_EXISTED_USER, UserJson, UserRo } from './ro/user.ro';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUser(id: string): Promise<UserRo> {
    const user = await this.userModel.findById(id);
    return user === null ? NOT_EXISTED_USER : UserJson.parse(user);
  }

  async createUser(newUserDto: NewUserDto): Promise<UserRo> {
    const user: UserDocument = await new this.userModel(newUserDto).save();
    return UserJson.parse(user);
  }

  async updateUser(id: string, updatedUserDto: UpdatedUserDto): Promise<any> {
    await this.userModel.updateOne({ _id: id }, updatedUserDto);
    return this.getUser(id);
  }

  async deleteUser(id: string): Promise<UserRo> {
    const user = this.getUser(id);
    await this.userModel.deleteOne({ _id: id });
    return user;
  }
}
