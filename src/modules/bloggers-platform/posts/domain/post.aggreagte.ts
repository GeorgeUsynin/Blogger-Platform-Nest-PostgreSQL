import { AggregateRoot } from '@nestjs/cqrs';
import {
  CreatePostInput,
  PostState,
  ReconstructPostInput,
  UpdatePostInput,
} from './types';

export class Post extends AggregateRoot {
  private constructor(private props: PostState) {
    super();
  }

  // ---------- factory ----------

  static create(input: CreatePostInput): Post {
    return new Post({
      id: undefined,
      blogId: input.blogId,
      title: input.title,
      shortDescription: input.shortDescription,
      content: input.content,
    });
  }

  static reconstruct(input: ReconstructPostInput): Post {
    return new Post(input);
  }

  // ---------- domain logic ----------

  public update(input: UpdatePostInput): void {
    this.props.blogId = input.blogId;
    this.props.title = input.title;
    this.props.shortDescription = input.shortDescription;
    this.props.content = input.content;
  }

  // ---------- getters ---------

  public get id(): PostState['id'] {
    return this.props.id;
  }

  public get blogId(): PostState['blogId'] {
    return this.props.blogId;
  }

  public get title(): PostState['title'] {
    return this.props.title;
  }

  public get shortDescription(): PostState['shortDescription'] {
    return this.props.shortDescription;
  }

  public get content(): PostState['content'] {
    return this.props.content;
  }
}
