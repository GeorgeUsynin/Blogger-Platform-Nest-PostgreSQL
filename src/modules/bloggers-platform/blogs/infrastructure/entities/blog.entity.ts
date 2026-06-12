import { Check, Column, Entity } from 'typeorm';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlCheckConstraints,
  websiteUrlConstraints,
} from './constraints';

@Check(websiteUrlCheckConstraints)
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
}
