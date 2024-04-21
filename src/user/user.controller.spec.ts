import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import {
  FAKE_USER_ID,
  UserStub1,
  UserStub2,
} from 'src/schema/user.schema.stub';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NOT_EXISTED_USER, UserJson } from './ro/user.ro';
import {
  NewUserDtoStub,
  UpdatedUserDtoStub1,
  UpdatedUserDtoStub2,
  UpdatedUserDtoStub3,
} from './dto/user.dto.stub';

describe('UserController', () => {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let userController: UserController;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: getModelToken(User.name), useValue: userModel },
        UserService,
      ],
    }).compile();
    userController = app.get<UserController>(UserController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    await new userModel(UserStub1()).save();
    await new userModel(UserStub2()).save();
  });

  type UserLike = {
    id: string;
    name: string;
    age: number;
  };
  const areUsersSame = (user1: UserLike, user2: UserLike): boolean => {
    return (
      user1.id === user2.id &&
      user1.name === user2.name &&
      user1.age === user2.age
    );
  };
  const isAllUserInDatabase = async (
    users: Array<UserLike>,
  ): Promise<boolean> => {
    const usersInDatabase = (await userModel.find().exec()).map((user) =>
      UserJson.parse(user),
    );
    if (users.length !== usersInDatabase.length) {
      return false;
    }
    for (const index in users) {
      if (!areUsersSame(users[index], usersInDatabase[index])) {
        return false;
      }
    }
    return true;
  };

  describe('getUser', () => {
    it('normal', async () => {
      await expect(
        userController.getUser({ id: UserStub1()._id }),
      ).resolves.toStrictEqual(UserJson.parse(UserStub1()));
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);
    });

    it('safe', async () => {
      await userController.getUser({ id: UserStub1()._id });
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);

      await userController.getUser({ id: UserStub1()._id });
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);
    });

    it('fake user', async () => {
      await expect(userController.getUser({ id: FAKE_USER_ID })).resolves.toBe(
        NOT_EXISTED_USER,
      );
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);
    });
  });

  describe('createUser', () => {
    it('normal', async () => {
      const newUser = (await userController.createUser(
        NewUserDtoStub(),
      )) as UserJson;
      expect(
        areUsersSame(newUser, {
          id: newUser.id,
          ...NewUserDtoStub(),
        }),
      ).toBe(true);
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
          newUser,
        ]),
      ).resolves.toBe(true);
    });
  });

  describe('updateUser', () => {
    it('normal', async () => {
      const newUser1 = (await userController.updateUser(
        { id: UserStub1()._id },
        UpdatedUserDtoStub1(),
      )) as UserJson;
      expect(
        areUsersSame(newUser1, {
          ...UserJson.parse(UserStub1()),
          ...UpdatedUserDtoStub1(),
        }),
      ).toBe(true);
      await expect(
        isAllUserInDatabase([newUser1, UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);

      const newUser2 = (await userController.updateUser(
        { id: UserStub1()._id },
        UpdatedUserDtoStub2(),
      )) as UserJson;
      expect(
        areUsersSame(newUser2, {
          ...UserJson.parse(UserStub1()),
          ...UpdatedUserDtoStub1(),
        }),
      ).toBe(true);
      await expect(
        isAllUserInDatabase([newUser2, UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);

      const newUser3 = (await userController.updateUser(
        { id: UserStub2()._id },
        UpdatedUserDtoStub3(),
      )) as UserJson;
      expect(
        areUsersSame(newUser3, {
          ...UserJson.parse(UserStub2()),
          ...UpdatedUserDtoStub3(),
        }),
      ).toBe(true);
      await expect(isAllUserInDatabase([newUser2, newUser3])).resolves.toBe(
        true,
      );
    });

    it('fake user', async () => {
      await expect(
        userController.updateUser({ id: FAKE_USER_ID }, UpdatedUserDtoStub1()),
      ).resolves.toBe(NOT_EXISTED_USER);
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);
    });
  });

  describe('replaceUser', () => {
    it('normal', async () => {
      const newUser = (await userController.replaceUser(
        { id: UserStub1()._id },
        NewUserDtoStub(),
      )) as UserJson;
      expect(
        areUsersSame(newUser, {
          id: UserStub1()._id,
          ...NewUserDtoStub(),
        }),
      ).toBe(true);
      await expect(
        isAllUserInDatabase([newUser, UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);
    });

    it('idempotent', async () => {
      const newUser = {
        id: UserStub1()._id,
        ...NewUserDtoStub(),
      };

      await userController.replaceUser(
        { id: UserStub1()._id },
        NewUserDtoStub(),
      );
      await expect(
        isAllUserInDatabase([newUser, UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);

      await userController.replaceUser(
        { id: UserStub1()._id },
        NewUserDtoStub(),
      );
      await expect(
        isAllUserInDatabase([newUser, UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);
    });

    it('fake user', async () => {
      await expect(
        userController.replaceUser({ id: FAKE_USER_ID }, NewUserDtoStub()),
      ).resolves.toBe(NOT_EXISTED_USER);
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('normal', async () => {
      const deletedUser = (await userController.deleteUser({
        id: UserStub1()._id,
      })) as UserJson;
      expect(areUsersSame(deletedUser, UserJson.parse(UserStub1()))).toBe(true);
      await expect(
        isAllUserInDatabase([UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);
    });

    it('idempotent', async () => {
      await userController.deleteUser({ id: UserStub1()._id });
      await expect(
        isAllUserInDatabase([UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);

      await userController.deleteUser({ id: UserStub1()._id });
      await expect(
        isAllUserInDatabase([UserJson.parse(UserStub2())]),
      ).resolves.toBe(true);
    });

    it('fake user', async () => {
      await expect(
        userController.deleteUser({ id: FAKE_USER_ID }),
      ).resolves.toBe(NOT_EXISTED_USER);
      await expect(
        isAllUserInDatabase([
          UserJson.parse(UserStub1()),
          UserJson.parse(UserStub2()),
        ]),
      ).resolves.toBe(true);
    });
  });
});
