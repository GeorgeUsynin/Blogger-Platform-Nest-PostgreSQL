import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUpdatedAtColumnTypeInQuestions1782420539071 implements MigrationInterface {
    name = 'UpdateUpdatedAtColumnTypeInQuestions1782420539071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "updatedAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "updatedAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "questions" ALTER COLUMN "updatedAt" SET NOT NULL`);
    }

}
