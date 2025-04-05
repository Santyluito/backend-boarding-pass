import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product Name is required' })
  @IsString({ message: 'Product Name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Product Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Product Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Product Price must be a decimal number' },
  )
  price: number;

  @IsNotEmpty({ message: 'Product Stock is required' })
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Product Stock must be a whole number' },
  )
  stock: number;

  @IsOptional()
  @IsString({ message: 'Product Image must be a string' })
  image: string;

  @IsNotEmpty({ message: 'Product Category is required' })
  @IsUUID(undefined, { message: 'Product Category must be a uuid string' })
  categoryId: string;
}
