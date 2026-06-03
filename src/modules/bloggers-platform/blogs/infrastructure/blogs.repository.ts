import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TBlogDB } from './types';
import {
  CreateBlogRepositoryDto,
  DeleteBlogRepositoryDto,
  UpdateBlogRepositoryDto,
} from './dto';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: number): Promise<TBlogDB | null> {
    const query = `
      SELECT * FROM public."Blogs" B
      WHERE B.ID = $1 AND B."isDeleted" = FALSE 
    `;

    const rows = await this.dataSource.query<TBlogDB[]>(query, [id]);

    return rows[0] ?? null;
  }

  async createBlog(dto: CreateBlogRepositoryDto): Promise<number | null> {
    const { name, description, websiteUrl } = dto;

    const query = `
      INSERT INTO
        PUBLIC."Blogs" (
          NAME,
          DESCRIPTION,
          "websiteUrl"
        )
      VALUES
        ($1, $2, $3)
      RETURNING ID
    `;

    const rows = await this.dataSource.query<{ id: number }[]>(query, [
      name,
      description,
      websiteUrl,
    ]);

    return rows[0].id ?? null;
  }

  async updateBlog(dto: UpdateBlogRepositoryDto): Promise<void> {
    const { id, name, description, websiteUrl, updatedAt } = dto;

    const query = `
      UPDATE PUBLIC."Blogs" B
      SET NAME = $1, DESCRIPTION = $2, "websiteUrl" = $3, "updatedAt" = $4
      WHERE B.ID = $5 AND B."isDeleted" = FALSE
    `;

    await this.dataSource.query(query, [
      name,
      description,
      websiteUrl,
      updatedAt,
      id,
    ]);
  }

  async deleteBlog(dto: DeleteBlogRepositoryDto): Promise<void> {
    const { id, isDeleted, deletedAt, updatedAt } = dto;

    const query = `
        UPDATE public."Blogs" B 
        SET "isDeleted" = $1, "deletedAt" = $2, "updatedAt" = $3
        WHERE B.ID = $4
        `;

    await this.dataSource.query(query, [isDeleted, deletedAt, updatedAt, id]);
  }
}
