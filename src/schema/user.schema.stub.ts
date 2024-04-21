import { User } from './user.schema';

export const FAKE_USER_ID = '000000000000000000000000';

export function UserStub1(): User {
  return {
    _id: '000000000000000000000001',
    name: 'jo',
    age: 20,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}

export function UserStub2(): User {
  return {
    _id: '000000000000000000000002',
    name: 'alan',
    age: 21,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  };
}
