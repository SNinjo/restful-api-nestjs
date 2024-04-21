import { User } from 'src/schema/user.schema';

export class UserJson {
  id: string;
  name: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;

  static parse(data: User) {
    const user = new UserJson();
    user.id = data._id.toString();
    user.name = data.name;
    user.age = data.age;
    user.createdAt = data.createdAt;
    user.updatedAt = data.updatedAt;
    return user;
  }
}

export const NOT_EXISTED_USER = 'null';

export type UserRo = UserJson | string;
