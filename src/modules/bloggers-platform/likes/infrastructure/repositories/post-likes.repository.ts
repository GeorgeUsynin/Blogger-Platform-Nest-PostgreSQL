import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILikesRepository } from './interfaces';
import { Like } from '../../domain';
import { PostLikeEntity } from '../entities';
import { LikeMapper } from '../like.mapper';

@Injectable()
export class PostLikesRepository implements ILikesRepository {
  constructor(
    @InjectRepository(PostLikeEntity)
    private postLikesRepo: Repository<PostLikeEntity>,
  ) {}
  async findById(id: number): Promise<WithId<Like> | null> {
    const entity = await this.postLikesRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async findByParentAndAuthor(
    parentId: number,
    authorId: number,
  ): Promise<WithId<Like> | null> {
    const entity = await this.postLikesRepo.findOneBy({
      parentId,
      authorId,
    });

    return this.mapToDomain(entity);
  }

  async deleteById(id: number): Promise<void> {
    await this.postLikesRepo.delete(id);
  }

  async saveLikeAggregate(like: Like): Promise<void> {
    const entity = LikeMapper.toPersistence(like);

    await this.postLikesRepo.save(entity);
  }

  private mapToDomain(entity: PostLikeEntity | null): WithId<Like> | null {
    if (!entity) return null;

    return LikeMapper.toDomain(entity);
  }
}
