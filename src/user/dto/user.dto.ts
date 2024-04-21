import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SpecifiedUserDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}

export class NewUserDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
}

export class UpdatedUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;
}
