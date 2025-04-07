import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  private capitalizeName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  async create(createStatusDto: CreateStatusDto) {
    const status = this.statusRepository.create({
      ...createStatusDto,
      name: this.capitalizeName(createStatusDto.name),
    });
    return await this.statusRepository.save(status);
  }

  findAll() {
    return this.statusRepository.find();
  }

  async findOne(id: string) {
    const status = await this.statusRepository.findOneBy({ id });
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto) {
    const status = await this.findOne(id);
    const updatedStatus = this.statusRepository.merge(status, updateStatusDto);
    return this.statusRepository.save(updatedStatus);
  }

  async remove(id: string) {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
    return `Status ${status.name} deleted`;
  }
}
