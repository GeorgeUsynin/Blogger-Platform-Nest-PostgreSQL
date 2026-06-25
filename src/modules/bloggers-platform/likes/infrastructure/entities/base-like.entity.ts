import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { LikeStatus, ParentType, type NonNoneLikeStatus } from '../../domain';
import { UserEntity } from '../../../../user-accounts/users/infrastructure/entities/user.entity';

@Unique(['authorId', 'parentId'])
export abstract class BaseLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  authorId: number;

  @Column({ type: 'integer' })
  parentId: number;

  @Column({ type: 'enum', enum: [ParentType.Comment, ParentType.Post] })
  parentType: ParentType;

  @Column({ type: 'enum', enum: [LikeStatus.Like, LikeStatus.Dislike] })
  likeStatus: NonNoneLikeStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' })
  user: UserEntity;
}
