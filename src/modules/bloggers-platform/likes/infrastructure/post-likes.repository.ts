import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TLikeDB } from './types';
import { CreateLikeRepositoryDto, UpdateLikeRepositoryDto } from './dto';
import { ILikesRepository } from './interfaces';

@Injectable()
export class PostLikesRepository implements ILikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}
  async findById(id: number): Promise<TLikeDB | null> {
    const query = `
      SELECT * FROM public."PostLikes" PL
      WHERE PL.ID = $1
    `;

    const rows = await this.dataSource.query<TLikeDB[]>(query, [id]);

    return rows[0] ?? null;
  }

  async findByParentAndAuthor(
    parentId: number,
    authorId: number,
  ): Promise<TLikeDB | null> {
    const query = `
      SELECT * FROM public."PostLikes" PL
      WHERE PL."parentId" = $1 AND PL."authorId" = $2
    `;

    const rows = await this.dataSource.query<TLikeDB[]>(query, [
      parentId,
      authorId,
    ]);

    return rows[0] ?? null;
  }

  async createLike(dto: CreateLikeRepositoryDto): Promise<void> {
    const { authorId, parentId, likeStatus } = dto;

    const query = `
        INSERT INTO
          PUBLIC."PostLikes" (
            "authorId",
            "parentId",
            "likeStatus"
          )
        VALUES
          ($1, $2, $3)
      `;

    await this.dataSource.query(query, [authorId, parentId, likeStatus]);
  }

  async updateLikeStatus(dto: UpdateLikeRepositoryDto): Promise<void> {
    const { id, likeStatus, updatedAt } = dto;

    const query = `
        UPDATE PUBLIC."PostLikes" PL
        SET "likeStatus" = $1, "updatedAt" = $2
        WHERE PL.ID = $3
      `;

    await this.dataSource.query(query, [likeStatus, updatedAt, id]);
  }

  async removeById(id: number): Promise<void> {
    const query = `
      DELETE FROM public."PostLikes" PL
	    WHERE PL.ID = $1
    `;

    await this.dataSource.query(query, [id]);
  }
}
