import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import {
  titleConstraints,
  shortDescriptionConstraints,
  contentConstraints,
} from './constraints';
import { BlogEntity } from '../../../blogs';

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

  @ManyToOne(() => BlogEntity, { nullable: false })
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: BlogEntity;
}
