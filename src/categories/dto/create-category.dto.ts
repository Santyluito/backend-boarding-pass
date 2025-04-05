import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString()
  name: string;
}
