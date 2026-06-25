import { Blog } from '../domain';
import { BlogEntity } from './entities/blog.entity';
import { WithId } from '../../../../types/common';

export class BlogMapper {
  static toDomain(entity: BlogEntity): WithId<Blog> {
    return Blog.reconstruct({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      websiteUrl: entity.websiteUrl,
      isMembership: entity.isMembership,
    }) as WithId<Blog>;
  }

  static toPersistence(blog: Blog): BlogEntity {
    const entity = new BlogEntity();

    if (blog.id) {
      entity.id = blog.id;
    }

    entity.name = blog.name;
    entity.description = blog.description;
    entity.websiteUrl = blog.websiteUrl;
    entity.isMembership = blog.isMembership;

    return entity;
  }
}
