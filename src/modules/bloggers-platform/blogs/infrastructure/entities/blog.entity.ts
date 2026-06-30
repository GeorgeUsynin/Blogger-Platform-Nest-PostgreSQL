import { Check, Column, Entity, Index, OneToMany } from 'typeorm';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlCheckConstraints,
  websiteUrlConstraints,
} from './constraints';
import type { PostEntity } from '../../../posts/infrastructure/entities/post.entity';

@Check(websiteUrlCheckConstraints)
@Index('idx_blogs_created_at', ['createdAt'])
@Index('idx_blogs_name_trgm', { synchronize: false })
@Entity({ name: DB_TABLE_NAMES.BLOGS })
export class BlogEntity extends BaseDBEntity {
  @Column({ type: 'varchar', length: nameConstraints.maxLength })
  name: string;

  @Column({ type: 'varchar', length: descriptionConstraints.maxLength })
  description: string;

  @Column({ type: 'varchar', length: websiteUrlConstraints.maxLength })
  websiteUrl: string;

  @Column({ type: 'boolean', default: false })
  isMembership: boolean;

  @OneToMany('PostEntity', (post: PostEntity) => post.blog)
  posts: PostEntity[];
}
