import { Injectable } from '@nestjs/common';
import { PostLikesRepository, CommentLikesRepository } from '../infrastructure';
import { Like, LikeStatus, ParentType } from '../domain';
import { SetLikeStatusDto } from './dto/set-like-status.dto';

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

      const like = Like.create({ authorId, parentId, parentType, likeStatus });
      await likesRepository.saveLikeAggregate(like);
    } else {
      switch (likeStatus) {
        case LikeStatus.None:
          await likesRepository.deleteById(foundLike.id);
          break;
        case LikeStatus.Like:
        case LikeStatus.Dislike:
          if (foundLike.isSameLikeStatus(likeStatus)) return;

          foundLike.updateLikeStatus(likeStatus);
          await likesRepository.saveLikeAggregate(foundLike);
          break;
      }
    }
  }
}
