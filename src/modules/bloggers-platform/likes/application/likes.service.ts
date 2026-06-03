import { Injectable } from '@nestjs/common';
import { PostLikesRepository, CommentLikesRepository } from '../infrastructure';
import { LikeStatus, ParentType } from '../domain';
import { SetLikeStatusDto } from './dto';
import {
  CreateLikeRepositoryDto,
  UpdateLikeRepositoryDto,
} from '../infrastructure/dto';

@Injectable()
export class LikesService {
  constructor(
    private postLikesRepository: PostLikesRepository,
    private commentLikesRepository: CommentLikesRepository,
  ) {}

  async setLikeStatus(dto: SetLikeStatusDto): Promise<void> {
    const { authorId, parentId, likeStatus, parentType } = dto;

    const likesRepository: PostLikesRepository | CommentLikesRepository =
      parentType === ParentType.Post
        ? this.postLikesRepository
        : this.commentLikesRepository;

    const foundLike = await likesRepository.findByParentAndAuthor(
      parentId,
      authorId,
    );

    if (!foundLike) {
      // not allowing like creation with None status
      if (likeStatus === LikeStatus.None) return;

      const createLikeRepositoryDto: CreateLikeRepositoryDto = {
        authorId,
        parentId,
        likeStatus,
      };

      await likesRepository.createLike(createLikeRepositoryDto);
    } else {
      // if likeStatus is the same -> exit
      if (foundLike.likeStatus === likeStatus) return;

      switch (likeStatus) {
        case LikeStatus.None:
          await likesRepository.removeById(foundLike.id);
          break;
        case LikeStatus.Like:
        case LikeStatus.Dislike:
          const updateLikeRepositoryDto: UpdateLikeRepositoryDto = {
            id: foundLike.id,
            likeStatus,
            updatedAt: new Date(),
          };
          await likesRepository.updateLikeStatus(updateLikeRepositoryDto);
          break;
      }
    }
  }
}
