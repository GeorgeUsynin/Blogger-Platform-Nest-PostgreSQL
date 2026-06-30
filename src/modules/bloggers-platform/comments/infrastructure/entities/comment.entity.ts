import { Check, Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import { contentCheckConstraints, contentConstraints } from './constraints';
import { UserEntity } from '../../../../user-accounts/users/infrastructure/entities/user.entity';
import { PostEntity } from '../../../posts/infrastructure/entities/post.entity';

Check(contentCheckConstraints);
@Index('idx_comments_created_at', ['createdAt'])
@Index('idx_comments_post_id_created_at', ['postId', 'createdAt'])
@Index('idx_comments_author_id', ['authorId'])
@Entity({ name: DB_TABLE_NAMES.COMMENTS })
export class CommentEntity extends BaseDBEntity {
  @Column({ type: 'integer' })
  authorId: number;

  @Column({ type: 'integer' })
  postId: number;

  @Column({ type: 'varchar', length: contentConstraints.maxLength })
  content: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  post: PostEntity;
}
