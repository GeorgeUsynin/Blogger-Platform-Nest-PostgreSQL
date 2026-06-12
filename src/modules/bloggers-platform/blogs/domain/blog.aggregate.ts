import { AggregateRoot } from '@nestjs/cqrs';
import {
  BlogState,
  CreateBlogInput,
  ReconstructBlogInput,
  UpdateInput,
} from './types';

export class Blog extends AggregateRoot {
  private constructor(private props: BlogState) {
    super();
  }

  // ---------- factory ----------

  static create(input: CreateBlogInput) {
    return new Blog({
      id: undefined,
      name: input.name,
      description: input.description,
      websiteUrl: input.websiteUrl,
      isMembership: false,
    });
  }

  static reconstruct(input: ReconstructBlogInput): Blog {
    return new Blog(input);
  }

  // ---------- domain logic ----------

  public update(input: UpdateInput): void {
    this.props.name = input.name;
    this.props.description = input.description;
    this.props.websiteUrl = input.websiteUrl;
  }

  // ---------- getters ---------

  public get id(): BlogState['id'] {
    return this.props.id;
  }

  public get name(): BlogState['name'] {
    return this.props.name;
  }

  public get description(): BlogState['description'] {
    return this.props.description;
  }

  public get websiteUrl(): BlogState['websiteUrl'] {
    return this.props.websiteUrl;
  }

  public get isMembership(): BlogState['isMembership'] {
    return this.props.isMembership;
  }
}
