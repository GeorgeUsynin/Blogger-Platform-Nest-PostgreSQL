import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusIndexToGameEntity1782814738485 implements MigrationInterface {
    name = 'AddStatusIndexToGameEntity1782814738485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" ALTER COLUMN "createdAt" DROP DEFAULT`);
        await queryRunner.query(`CREATE INDEX "status_idx" ON "games"  ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."status_idx"`);
        await queryRunner.query(`ALTER TABLE "answers" ALTER COLUMN "createdAt" SET DEFAULT now()`);
    }

}
