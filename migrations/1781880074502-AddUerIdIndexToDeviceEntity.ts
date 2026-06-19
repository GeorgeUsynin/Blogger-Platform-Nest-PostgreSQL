import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUerIdIndexToDeviceEntity1781880074502 implements MigrationInterface {
    name = 'AddUerIdIndexToDeviceEntity1781880074502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "userId_idx" ON "devices"  ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."userId_idx"`);
    }

}
