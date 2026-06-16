import { AggregateRoot } from '@nestjs/cqrs';
import {
  CreateLikeInput,
  LikeState,
  NonNoneLikeStatus,
  ReconstructLikeInput,
} from './types';

export class Like extends AggregateRoot {
  private constructor(private props: LikeState) {
    super();
  }

  // ---------- factory ----------

  static create(input: CreateLikeInput): Like {
    return new Like({
      id: undefined,
      authorId: input.authorId,
      parentId: input.parentId,
      parentType: input.parentType,
      likeStatus: input.likeStatus,
    });
  }

  static reconstruct(input: ReconstructLikeInput): Like {
    return new Like(input);
  }

  // ---------- domain logic ----------

  public updateLikeStatus(likeStatus: NonNoneLikeStatus): void {
    this.props.likeStatus = likeStatus;
  }

  // ---------- queries ----------

  public isSameLikeStatus(likeStatus: NonNoneLikeStatus): boolean {
    return this.likeStatus === likeStatus;
  }

  // ---------- getters ---------

  public get id(): LikeState['id'] {
    return this.props.id;
  }

  public get authorId(): LikeState['authorId'] {
    return this.props.authorId;
  }

  public get parentId(): LikeState['parentId'] {
    return this.props.parentId;
  }

  public get parentType(): LikeState['parentType'] {
    return this.props.parentType;
  }

  public get likeStatus(): LikeState['likeStatus'] {
    return this.props.likeStatus;
  }
}
