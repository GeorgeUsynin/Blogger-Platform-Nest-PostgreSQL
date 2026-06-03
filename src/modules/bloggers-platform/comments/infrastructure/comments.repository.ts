import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TCommentDB } from './types';
import {
  CreateCommentRepositoryDto,
  DeleteCommentRepositoryDto,
  UpdateCommentRepositoryDto,
} from './dto';

@Injectable()
export class CommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: number): Promise<TCommentDB | null> {
    const query = `
          SELECT * FROM public."Comments" C
          WHERE C.ID = $1 AND C."isDeleted" = FALSE 
        `;

    const rows = await this.dataSource.query<TCommentDB[]>(query, [id]);

    return rows[0] ?? null;
  }

  async createComment(dto: CreateCommentRepositoryDto): Promise<number | null> {
    const { authorId, postId, content } = dto;

    const query = `
      INSERT INTO
        PUBLIC."Comments" (
          "authorId",
          "postId",
          "content"
        )
      VALUES
        ($1, $2, $3)
      RETURNING ID
    `;

    const rows = await this.dataSource.query<{ id: number }[]>(query, [
      authorId,
      postId,
      content,
    ]);

    return rows[0].id ?? null;
  }

  async updateContent(dto: UpdateCommentRepositoryDto): Promise<void> {
    const { content, updatedAt, id } = dto;

    const query = `
          UPDATE public."Comments" C
          SET CONTENT = $1, "updatedAt" = $2
          WHERE C.ID = $3 AND C."isDeleted" = FALSE 
        `;

    await this.dataSource.query<TCommentDB[]>(query, [content, updatedAt, id]);
  }

  async deleteComment(dto: DeleteCommentRepositoryDto): Promise<void> {
    const { id, isDeleted, deletedAt, updatedAt } = dto;

    const query = `
          UPDATE public."Comments" C 
          SET "isDeleted" = $1, "deletedAt" = $2, "updatedAt" = $3
          WHERE C.ID = $4
          `;

    await this.dataSource.query(query, [isDeleted, deletedAt, updatedAt, id]);
  }
}
