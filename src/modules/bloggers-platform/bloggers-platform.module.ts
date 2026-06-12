import { Module } from '@nestjs/common';
import { BlogEntity, BlogsController, blogsProviders } from './blogs';
import { PostsController, postsProviders } from './posts';
import { CommentsController, commentsProviders } from './comments';
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
  imports: [UserAccountsModule, TypeOrmModule.forFeature([BlogEntity])],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
