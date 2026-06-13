import { Module } from '@nestjs/common';
import { BlogEntity, BlogsController, blogsProviders } from './blogs';
import { PostEntity, PostsController, postsProviders } from './posts';
import {
  CommentEntity,
  CommentsController,
  commentsProviders,
} from './comments';
import { likesProviders } from './likes';
import { UserAccountsModule } from '../user-accounts';
import { TypeOrmModule } from '@nestjs/typeorm';

const controllers = [BlogsController, PostsController, CommentsController];
const providers = [
  ...blogsProviders,
  ...postsProviders,
  ...commentsProviders,
  ...likesProviders,
];

@Module({
  imports: [
    UserAccountsModule,
    TypeOrmModule.forFeature([BlogEntity, PostEntity, CommentEntity]),
  ],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
