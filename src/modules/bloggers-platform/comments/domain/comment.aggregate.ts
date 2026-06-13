import { AggregateRoot } from '@nestjs/cqrs';
import {
  CommentState,
  CreateCommentInput,
  ReconstructCommentInput,
  UpdateCommentInput,
} from './types';
import { NotAnOwnerOfThisComment } from '../../../../core/exceptions';

export class Comment extends AggregateRoot {
  private constructor(private props: CommentState) {
    super();
  }

  // ---------- factory ----------

  static create(input: CreateCommentInput): Comment {
    return new Comment({
      id: undefined,
      authorId: input.authorId,
      postId: input.postId,
      content: input.content,
    });
  }

  static reconstruct(input: ReconstructCommentInput): Comment {
    return new Comment(input);
  }

  // ---------- domain logic ----------

  public update(input: UpdateCommentInput): void {
    this.props.content = input.content;
  }

  // ---------- guards ----------

  public ensureCommentOwner(userId: number) {
    if (this.authorId !== userId) {
      throw new NotAnOwnerOfThisComment();
    }
  }

  // ---------- getters ---------

  public get id(): CommentState['id'] {
    return this.props.id;
  }

  public get authorId(): CommentState['authorId'] {
    return this.props.authorId;
  }

  public get postId(): CommentState['postId'] {
    return this.props.postId;
  }

  public get content(): CommentState['content'] {
    return this.props.content;
  }
}
