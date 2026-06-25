import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { GetBlogsQueryParamsInputDto } from '../../../api/dto/input-dto/get-blogs-query-params.input-dto';
import { BlogSortByFields } from '../../../api/dto/input-dto/blog-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { BlogEntity } from '../../entities/blog.entity';
import { BlogQueryModel } from './model/BlogQueryModel';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
  ) {}

  async getAllBlogs(
    query: GetBlogsQueryParamsInputDto,
  ): Promise<{ items: BlogQueryModel[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, searchNameTerm } = query;

    const safeSortBy = Object.values(BlogSortByFields).includes(sortBy)
      ? sortBy
      : BlogSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Desc.toUpperCase();

    const where: FindOptionsWhere<BlogEntity>[] = [];

    if (searchNameTerm) {
      where.push({ name: ILike(`%${searchNameTerm}%`) });
    }

    const [items, totalCount] = await this.blogRepo.findAndCount({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        isMembership: true,
        createdAt: true,
      },
      order: {
        [safeSortBy]: safeSortDirection,
      },
      skip: query.calculateSkip(),
      take: pageSize,
    });

    return {
      items: items.map((blog) => ({
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        isMembership: blog.isMembership,
        createdAt: blog.createdAt,
      })),
      totalCount,
    };
  }

  async getBlogById(id: number): Promise<BlogQueryModel | null> {
    const blog = await this.blogRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        isMembership: true,
        createdAt: true,
      },
    });

    if (!blog) return null;

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt,
    };
  }
}
