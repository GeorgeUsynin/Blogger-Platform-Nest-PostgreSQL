import { Comment } from '../domain';
import { CommentEntity } from './entities';
import { WithId } from '../../../../types/common';

export class CommentMapper {
  static toDomain(entity: CommentEntity): WithId<Comment> {
    return Comment.reconstruct({
      id: entity.id,
      authorId: entity.authorId,
      postId: entity.postId,
      content: entity.content,
    }) as WithId<Comment>;
  }

  static toPersistence(comment: Comment): CommentEntity {
    const entity = new CommentEntity();

    if (comment.id) {
      entity.id = comment.id;
    }

    entity.authorId = comment.authorId;
    entity.postId = comment.postId;
    entity.content = comment.content;

    return entity;
  }
}
