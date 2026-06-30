import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1782823231965 implements MigrationInterface {
  name = 'AddIndexes1782823231965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
    await queryRunner.query(
      `CREATE INDEX "idx_users_created_at" ON "users"  ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_login_trgm" ON "users" USING gin ("login" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_email_trgm" ON "users" USING gin ("email" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_email_confirmations_confirmation_code" ON "email_confirmations"  ("confirmationCode") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_password_recoveries_recovery_code" ON "password_recoveries"  ("recoveryCode") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_blogs_created_at" ON "blogs"  ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_blogs_name_trgm" ON "blogs" USING gin ("name" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_blog_id_created_at" ON "posts"  ("blogId", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_posts_created_at" ON "posts"  ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_comments_author_id" ON "comments"  ("authorId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_comments_post_id_created_at" ON "comments"  ("postId", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_comments_created_at" ON "comments"  ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_comment_likes_parent_status_created_at" ON "comment_likes"  ("parentId", "likeStatus", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_post_likes_parent_status_created_at" ON "post_likes"  ("parentId", "likeStatus", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_answers_question_id" ON "answers"  ("questionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_answers_player_progress_id_created_at" ON "answers"  ("playerProgressId", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_games_to_questions_game_id_order" ON "games_to_questions"  ("gameId", "order") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_games_status_created_at" ON "games"  ("status", "createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_games_created_at" ON "games"  ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_player_progresses_user_id_game_id" ON "player_progresses"  ("userId", "gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_player_progresses_game_id" ON "player_progresses"  ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_questions_is_published" ON "questions"  ("isPublished") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_questions_created_at" ON "questions"  ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_questions_body_trgm" ON "questions" USING gin ("body" gin_trgm_ops)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_questions_body_trgm"`);
    await queryRunner.query(`DROP INDEX "public"."idx_questions_created_at"`);
    await queryRunner.query(`DROP INDEX "public"."idx_questions_is_published"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_player_progresses_game_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_player_progresses_user_id_game_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_games_created_at"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_games_status_created_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_games_to_questions_game_id_order"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_answers_player_progress_id_created_at"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_answers_question_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_post_likes_parent_status_created_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_comment_likes_parent_status_created_at"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_comments_created_at"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_comments_post_id_created_at"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_comments_author_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_posts_created_at"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_posts_blog_id_created_at"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_blogs_name_trgm"`);
    await queryRunner.query(`DROP INDEX "public"."idx_blogs_created_at"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_password_recoveries_recovery_code"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_email_confirmations_confirmation_code"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_users_email_trgm"`);
    await queryRunner.query(`DROP INDEX "public"."idx_users_login_trgm"`);
    await queryRunner.query(`DROP INDEX "public"."idx_users_created_at"`);
  }
}
