import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
