import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScoreColumnToPlayerProgressEntity1782767012413 implements MigrationInterface {
    name = 'AddScoreColumnToPlayerProgressEntity1782767012413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_progresses" ADD "score" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_progresses" DROP COLUMN "score"`);
    }

}
