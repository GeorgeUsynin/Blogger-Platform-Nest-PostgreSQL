import { Post } from '../domain';
import { PostEntity } from './entities/post.entity';
import { WithId } from '../../../../types/common';

export class PostMapper {
  static toDomain(entity: PostEntity): WithId<Post> {
    return Post.reconstruct({
      id: entity.id,
      blogId: entity.blogId,
      title: entity.title,
      shortDescription: entity.shortDescription,
      content: entity.content,
    }) as WithId<Post>;
  }

  static toPersistence(post: Post): PostEntity {
    const entity = new PostEntity();

    if (post.id) {
      entity.id = post.id;
    }

    entity.blogId = post.blogId;
    entity.title = post.title;
    entity.shortDescription = post.shortDescription;
    entity.content = post.content;

    return entity;
  }
}
