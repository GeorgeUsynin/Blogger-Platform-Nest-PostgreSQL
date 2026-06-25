import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { Blog } from '../../domain';
import { BlogMapper } from '../blog.mapper';
import { WithId } from '../../../../../types/common';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(BlogEntity) private blogsRepo: Repository<BlogEntity>,
  ) {}

  async findById(id: number): Promise<WithId<Blog> | null> {
    const entity = await this.blogsRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async softDeleteBlogById(id: number): Promise<void> {
    await this.blogsRepo.softDelete(id);
  }

  async saveBlogAggregate(blog: Blog): Promise<number> {
    const entity = BlogMapper.toPersistence(blog);

    const result = await this.blogsRepo.save(entity);

    return result.id;
  }

  private mapToDomain(entity: BlogEntity | null): WithId<Blog> | null {
    if (!entity) return null;

    return BlogMapper.toDomain(entity);
  }
}
