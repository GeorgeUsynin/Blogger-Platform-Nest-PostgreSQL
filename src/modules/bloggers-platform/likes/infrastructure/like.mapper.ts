import { ParentType, Like } from '../domain';
import { PostLikeEntity, CommentLikeEntity } from './entities';

export class LikeMapper {
  static toDomain(entity: PostLikeEntity | CommentLikeEntity): WithId<Like> {
    return Like.reconstruct({
      id: entity.id,
      authorId: entity.authorId,
      parentId: entity.parentId,
      parentType: entity.parentType,
      likeStatus: entity.likeStatus,
    }) as WithId<Like>;
  }

  static toPersistence(like: Like): CommentLikeEntity | PostLikeEntity {
    const entity =
      like.parentType === ParentType.Comment
        ? new CommentLikeEntity()
        : new PostLikeEntity();

    if (like.id) {
      entity.id = like.id;
    }

    entity.authorId = like.authorId;
    entity.parentId = like.parentId;
    entity.parentType = like.parentType;
    entity.likeStatus = like.likeStatus;

    return entity;
  }
}
