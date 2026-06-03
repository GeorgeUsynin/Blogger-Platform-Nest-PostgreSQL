import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from '../../../../likes/domain';
import { CommentReadDto } from '../../../infrastructure/query';

class CommentatorInfo {
  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  userLogin: string;
}

class LikesInfo {
  @ApiProperty({ type: Number, description: 'Total likes for parent item' })
  likesCount: number;

  @ApiProperty({ type: Number, description: 'Total dislikes for parent item' })
  dislikesCount: number;

  @ApiProperty({
    enum: LikeStatus,
    description: 'Send None if you want to unlike\/undislike',
  })
  myStatus: LikeStatus;
}

export class CommentViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  commentatorInfo: CommentatorInfo;

  @ApiProperty()
  likesInfo: LikesInfo;

  @ApiProperty({ type: Date })
  createdAt: Date;

  public static mapToView(comment: CommentReadDto): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment.id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.authorId.toString(),
      userLogin: comment.authorLogin,
    };
    dto.createdAt = comment.createdAt;
    dto.likesInfo = {
      dislikesCount: comment.dislikesCount,
      likesCount: comment.likesCount,
      myStatus: comment.myStatus ?? LikeStatus.None,
    };

    return dto;
  }
}
