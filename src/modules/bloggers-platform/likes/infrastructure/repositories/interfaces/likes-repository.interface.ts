import { Like } from '../../../domain';
import { WithId } from '../../../../../../types/common';

export interface ILikesRepository {
  findById(id: number): Promise<WithId<Like> | null>;

  findByParentAndAuthor(
    parentId: number,
    authorId: number,
  ): Promise<WithId<Like> | null>;

  deleteById(id: number): Promise<void>;

  saveLikeAggregate(like: Like): Promise<void>;
}
