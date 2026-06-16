import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController, blogsProviders } from './blogs';
import { PostsController, postsProviders } from './posts';
import { CommentsController, commentsProviders } from './comments';
import { likesProviders } from './likes';
import { UserAccountsModule } from '../user-accounts';
import { BlogEntity } from './blogs/infrastructure/entities/blog.entity';
import { PostEntity } from './posts/infrastructure/entities/post.entity';
import { CommentEntity } from './comments/infrastructure/entities/comment.entity';
import { CommentLikeEntity } from './likes/infrastructure/entities/comment-like.entity';
import { PostLikeEntity } from './likes/infrastructure/entities/post-like.entity';

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
    TypeOrmModule.forFeature([
      BlogEntity,
      PostEntity,
      CommentEntity,
      PostLikeEntity,
      CommentLikeEntity,
    ]),
  ],
  controllers: [...controllers],
  providers: [...providers],
})
export class BloggersPlatformModule {}
