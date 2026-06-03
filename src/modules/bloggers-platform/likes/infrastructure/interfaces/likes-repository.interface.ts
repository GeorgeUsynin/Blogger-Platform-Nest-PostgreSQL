import { CreateLikeRepositoryDto, UpdateLikeRepositoryDto } from '../dto';
import { TLikeDB } from '../types';

export interface ILikesRepository {
  findById(id: number): Promise<TLikeDB | null>;

  findByParentAndAuthor(
    parentId: number,
    authorId: number,
  ): Promise<TLikeDB | null>;

  createLike(dto: CreateLikeRepositoryDto): Promise<void>;

  updateLikeStatus(dto: UpdateLikeRepositoryDto): Promise<void>;

  removeById(id: number): Promise<void>;
}
