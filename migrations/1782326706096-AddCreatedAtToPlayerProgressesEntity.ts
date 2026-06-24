import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToPlayerProgressesEntity1782326706096 implements MigrationInterface {
    name = 'AddCreatedAtToPlayerProgressesEntity1782326706096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_progresses" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_progresses" DROP COLUMN "createdAt"`);
    }

}
