import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities';
import { CommentMapper } from '../comment.mapper';
import { Comment } from '../../domain';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepo: Repository<CommentEntity>,
  ) {}

  async findById(id: number): Promise<WithId<Comment> | null> {
    const entity = await this.commentsRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async softDeleteCommentById(id: number): Promise<void> {
    await this.commentsRepo.softDelete(id);
  }

  async saveCommentAggregate(comment: Comment): Promise<number> {
    const entity = CommentMapper.toPersistence(comment);

    const result = await this.commentsRepo.save(entity);

    return result.id;
  }

  private mapToDomain(entity: CommentEntity | null): WithId<Comment> | null {
    if (!entity) return null;

    return CommentMapper.toDomain(entity);
  }
}
