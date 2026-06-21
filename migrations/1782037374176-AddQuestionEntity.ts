import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionEntity1782037374176 implements MigrationInterface {
    name = 'AddQuestionEntity1782037374176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "body" character varying(500) NOT NULL, "correctAnswers" jsonb NOT NULL, "isPublished" boolean NOT NULL, CONSTRAINT "CHK_d2a9f42c95e54ada3719b63290" CHECK (
    length(body) BETWEEN 10 AND 500
), CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "questions"`);
    }

}
