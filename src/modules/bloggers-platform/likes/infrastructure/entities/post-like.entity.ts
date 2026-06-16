import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseLikeEntity } from './base-like.entity';
import { PostEntity } from '../../../posts/infrastructure';

@Entity({ name: DB_TABLE_NAMES.POST_LIKES })
export class PostLikeEntity extends BaseLikeEntity {
  @ManyToOne(() => PostEntity, { nullable: false })
  @JoinColumn({ name: 'parentId', referencedColumnName: 'id' })
  post: PostEntity;
}
