import { InjectModel } from '@nestjs/mongoose';
import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { Blog, type BlogModelType } from '../bloggers-platform/blogs/domain';
import { Post, type PostModelType } from '../bloggers-platform/posts/domain';
import { Like, type LikeModelType } from '../bloggers-platform/likes/domain';
import {
  Comment,
  type CommentModelType,
} from '../bloggers-platform/comments/domain';

import { TestingAllDataApi } from './swagger/testing-all-data.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    const query = `
    TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE
    `;

    await this.dataSource.query(query);
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.LikeModel.deleteMany();
    await this.CommentModel.deleteMany();
  }
}
