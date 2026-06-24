import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitGameEntities1782232638596 implements MigrationInterface {
  name = 'InitGameEntities1782232638596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "games_to_questions" ("id" SERIAL NOT NULL, "gameId" integer NOT NULL, "questionId" integer NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_113e575030a1a32598e6493ca0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_17989c93368099cfdee723ba57" ON "games_to_questions"  ("gameId", "questionId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."games_status_enum" AS ENUM('Active', 'Finished', 'PendingSecondPlayer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "games" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "status" "public"."games_status_enum" NOT NULL, "finishGameDate" TIMESTAMP WITH TIME ZONE, "startGameDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_progresses" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_3b654c951380c78bd4c3809ad8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."answers_answerstatus_enum" AS ENUM('Correct', 'Incorrect')`,
    );
    await queryRunner.query(
      `CREATE TABLE "answers" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "playerProgressId" integer NOT NULL, "body" character varying NOT NULL, "answerStatus" "public"."answers_answerstatus_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "games_to_questions" ADD CONSTRAINT "FK_ad472e7143f59895c7130943b48" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "games_to_questions" ADD CONSTRAINT "FK_ed6c5b40c3f1963cc60d71a4d95" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progresses" ADD CONSTRAINT "FK_9702a373fd9c56d958716344468" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progresses" ADD CONSTRAINT "FK_176dd0ba4efba2cab36bf70164f" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" ADD CONSTRAINT "FK_3f68f0703aaa6ab896ecf128267" FOREIGN KEY ("playerProgressId") REFERENCES "player_progresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_3f68f0703aaa6ab896ecf128267"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progresses" DROP CONSTRAINT "FK_176dd0ba4efba2cab36bf70164f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progresses" DROP CONSTRAINT "FK_9702a373fd9c56d958716344468"`,
    );
    await queryRunner.query(
      `ALTER TABLE "games_to_questions" DROP CONSTRAINT "FK_ed6c5b40c3f1963cc60d71a4d95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "games_to_questions" DROP CONSTRAINT "FK_ad472e7143f59895c7130943b48"`,
    );
    await queryRunner.query(`DROP TABLE "answers"`);
    await queryRunner.query(`DROP TYPE "public"."answers_answerstatus_enum"`);
    await queryRunner.query(`DROP TABLE "player_progresses"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TYPE "public"."games_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17989c93368099cfdee723ba57"`,
    );
    await queryRunner.query(`DROP TABLE "games_to_questions"`);
  }
}
