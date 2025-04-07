import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.checkDuplicateName(createProductDto.name);
    const category = await this.findCategory(createProductDto.categoryId);
    return this.productRepository.save({ ...createProductDto, category });
  }

  async findAll(categoryId?: string, limit?: number, offset?: number) {
    const [products, total] = await this.productRepository.findAndCount({
      where: categoryId ? { category: { id: categoryId } } : undefined,
      relations: { category: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return { products, total, limit, offset };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.name) {
      await this.checkDuplicateName(updateProductDto.name, id);
    }

    if (updateProductDto.categoryId) {
      product.category = await this.findCategory(updateProductDto.categoryId);
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return `Product ${product.name} deleted`;
  }

  private async checkDuplicateName(name: string, excludeId?: string) {
    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });

    if (existingProduct && existingProduct.id !== excludeId) {
      throw new ConflictException('Product with this name already exists');
    }
  }

  private async findCategory(categoryId: string) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
