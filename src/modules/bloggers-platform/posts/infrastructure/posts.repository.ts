import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TPostDB, WithBlogName } from './types';
import {
  CreatePostRepositoryDto,
  DeletePostRepositoryDto,
  UpdatePostRepositoryDto,
} from './dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: number): Promise<TPostDB | null> {
    const query = `
          SELECT P.*, B."name" as "blogName" 
          FROM public."Posts" P
          JOIN public."Blogs" B
          ON P."blogId" = B.ID
          WHERE P.ID = $1 AND P."isDeleted" = FALSE 
        `;

    const rows = await this.dataSource.query<WithBlogName<TPostDB>[]>(query, [
      id,
    ]);

    return rows[0] ?? null;
  }

  async createPost(dto: CreatePostRepositoryDto): Promise<number | null> {
    const { title, shortDescription, content, blogId, createdAt, updatedAt } =
      dto;

    const query = `
      INSERT INTO
        PUBLIC."Posts" (
          "blogId",
          TITLE,
          "shortDescription",
          CONTENT,
          "createdAt",
          "updatedAt"
        )
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING ID
      `;

    const rows = await this.dataSource.query<{ id: number }[]>(query, [
      blogId,
      title,
      shortDescription,
      content,
      createdAt,
      updatedAt,
    ]);

    return rows[0].id ?? null;
  }

  async updatePost(dto: UpdatePostRepositoryDto): Promise<void> {
    const { id, title, shortDescription, blogId, content, updatedAt } = dto;

    const query = `
        UPDATE PUBLIC."Posts" P
        SET TITLE = $1, "shortDescription" = $2, "blogId" = $3, 
        CONTENT = $4, "updatedAt" = $5
        WHERE P.ID = $6 AND P."isDeleted" = FALSE
      `;

    await this.dataSource.query(query, [
      title,
      shortDescription,
      blogId,
      content,
      updatedAt,
      id,
    ]);
  }

  async deletePost(dto: DeletePostRepositoryDto): Promise<void> {
    const { id, isDeleted, deletedAt, updatedAt } = dto;

    const query = `
          UPDATE public."Posts" P 
          SET "isDeleted" = $1, "deletedAt" = $2, "updatedAt" = $3
          WHERE P.ID = $4
          `;

    await this.dataSource.query(query, [isDeleted, deletedAt, updatedAt, id]);
  }
}
