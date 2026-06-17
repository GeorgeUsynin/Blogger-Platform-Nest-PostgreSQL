import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { Post } from '../../domain';
import { PostMapper } from '../post.mapper';
import { WithId } from '../../../../../types/common';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>,
  ) {}

  async findById(id: number): Promise<WithId<Post> | null> {
    const entity = await this.postsRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async softDeletePostById(id: number): Promise<void> {
    await this.postsRepo.softDelete(id);
  }

  async savePostAggregate(post: Post): Promise<number> {
    const entity = PostMapper.toPersistence(post);

    const result = await this.postsRepo.save(entity);

    return result.id;
  }

  private mapToDomain(entity: PostEntity | null): WithId<Post> | null {
    if (!entity) return null;

    return PostMapper.toDomain(entity);
  }
}
