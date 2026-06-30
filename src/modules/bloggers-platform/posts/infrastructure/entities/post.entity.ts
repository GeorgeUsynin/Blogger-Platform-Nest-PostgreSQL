import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import {
  titleConstraints,
  shortDescriptionConstraints,
  contentConstraints,
} from './constraints';
import type { BlogEntity } from '../../../blogs/infrastructure/entities/blog.entity';

@Index('idx_posts_created_at', ['createdAt'])
@Index('idx_posts_blog_id_created_at', ['blogId', 'createdAt'])
@Entity({ name: DB_TABLE_NAMES.POSTS })
export class PostEntity extends BaseDBEntity {
  @Column({ type: 'integer' })
  blogId: number;

  @Column({ type: 'varchar', length: titleConstraints.maxLength })
  title: string;

  @Column({ type: 'varchar', length: shortDescriptionConstraints.maxLength })
  shortDescription: string;

  @Column({ type: 'varchar', length: contentConstraints.maxLength })
  content: string;

  @ManyToOne('BlogEntity', { nullable: false })
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: BlogEntity;
}
