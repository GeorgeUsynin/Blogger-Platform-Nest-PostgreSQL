import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILikesRepository } from './interfaces';
import { Like } from '../../domain';
import { CommentLikeEntity } from '../entities';
import { LikeMapper } from '../like.mapper';
import { WithId } from '../../../../../types/common';

@Injectable()
export class CommentLikesRepository implements ILikesRepository {
  constructor(
    @InjectRepository(CommentLikeEntity)
    private commentLikesRepo: Repository<CommentLikeEntity>,
  ) {}
  async findById(id: number): Promise<WithId<Like> | null> {
    const entity = await this.commentLikesRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async findByParentAndAuthor(
    parentId: number,
    authorId: number,
  ): Promise<WithId<Like> | null> {
    const entity = await this.commentLikesRepo.findOneBy({
      parentId,
      authorId,
    });

    return this.mapToDomain(entity);
  }

  async deleteById(id: number): Promise<void> {
    await this.commentLikesRepo.delete(id);
  }

  async saveLikeAggregate(like: Like): Promise<void> {
    const entity = LikeMapper.toPersistence(like);

    await this.commentLikesRepo.save(entity);
  }

  private mapToDomain(entity: CommentLikeEntity | null): WithId<Like> | null {
    if (!entity) return null;

    return LikeMapper.toDomain(entity);
  }
}
