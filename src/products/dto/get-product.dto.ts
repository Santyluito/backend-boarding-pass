import { IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class GetProductsQueryDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'Product Category must be a uuid string' })
  category_id?: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Limit must be a number' })
  limit?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'Offset must be a number' })
  offset?: number;
}
