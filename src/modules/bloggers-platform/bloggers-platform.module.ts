import { Module } from '@nestjs/common';
import { BlogsController, blogsProviders } from './blogs';
import { PostsController, postsProviders } from './posts';
import { CommentsController, commentsProviders } from './comments';
import { likesProviders } from './likes';
import { UserAccountsModule } from '../user-accounts';

const controllers = [BlogsController, PostsController, CommentsController];
const providers = [
  ...blogsProviders,
  ...postsProviders,
  ...commentsProviders,
  ...likesProviders,
];

@Module({
  imports: [UserAccountsModule],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
