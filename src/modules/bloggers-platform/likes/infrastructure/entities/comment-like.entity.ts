import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseLikeEntity } from './base-like.entity';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { CommentEntity } from '../../../comments/infrastructure/entities/comment.entity';

@Entity({ name: DB_TABLE_NAMES.COMMENT_LIKES })
export class CommentLikeEntity extends BaseLikeEntity {
  @ManyToOne(() => CommentEntity, { nullable: false })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  comment: CommentEntity;
}
