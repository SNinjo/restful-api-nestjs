import { NewUserDto, UpdatedUserDto } from './user.dto';

export function NewUserDtoStub(): NewUserDto {
  return {
    name: 'john',
    age: 30,
  };
}

export function UpdatedUserDtoStub1(): UpdatedUserDto {
  return {
    name: 'john',
    age: 30,
  };
}

export function UpdatedUserDtoStub2(): UpdatedUserDto {
  return {
    name: 'john',
  };
}

export function UpdatedUserDtoStub3(): UpdatedUserDto {
  return {};
}
