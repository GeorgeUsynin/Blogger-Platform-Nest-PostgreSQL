import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1781690984146 implements MigrationInterface {
    name = 'Init1781690984146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_recoveries" ("userId" integer NOT NULL, "recoveryCode" uuid, "expirationDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_db7fec32d882a9412d8081037ae" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "login" character varying(10) NOT NULL, "email" character varying(100) NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "CHK_02f6c48ee45992077088cfac05" CHECK (
    length(email) <= 100
    AND email ~ '^[A-Za-z0-9_.-]+@([A-Za-z0-9-]+[.])+[A-Za-z0-9-]{2,4}$'
), CONSTRAINT "CHK_7f2b6ab27331e93721ea3217fd" CHECK (
    length(login) BETWEEN 3 AND 10
    AND login ~ '^[A-Za-z0-9_-]*$'
), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_confirmations" ("userId" integer NOT NULL, "isConfirmed" boolean NOT NULL, "confirmationCode" uuid, "expirationDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_930e1d7c0171d23e5535b1e3873" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "devices" ("deviceId" uuid NOT NULL, "userId" integer NOT NULL, "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deviceName" character varying NOT NULL, "clientIp" character varying NOT NULL, "expiresIn" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_666c9b59efda8ca85b29157152c" PRIMARY KEY ("deviceId"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "blogId" integer NOT NULL, "title" character varying(30) NOT NULL, "shortDescription" character varying(100) NOT NULL, "content" character varying(1000) NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_likes" ("id" SERIAL NOT NULL, "authorId" integer NOT NULL, "parentId" integer NOT NULL, "parentType" "public"."post_likes_parenttype_enum" NOT NULL, "likeStatus" "public"."post_likes_likestatus_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_1ff5fe759cd16ff04d41ca6bb54" UNIQUE ("authorId", "parentId"), CONSTRAINT "PK_e4ac7cb9daf243939c6eabb2e0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying(15) NOT NULL, "description" character varying(500) NOT NULL, "websiteUrl" character varying(100) NOT NULL, "isMembership" boolean NOT NULL DEFAULT false, CONSTRAINT "CHK_2e47209383a7c56b6f9f0e5f04" CHECK (
    length("websiteUrl") <= 100
    AND "websiteUrl" ~ '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$'
), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "authorId" integer NOT NULL, "postId" integer NOT NULL, "content" character varying(300) NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_likes" ("id" SERIAL NOT NULL, "authorId" integer NOT NULL, "parentId" integer NOT NULL, "parentType" "public"."comment_likes_parenttype_enum" NOT NULL, "likeStatus" "public"."comment_likes_likestatus_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_307d6cf83d1a52c7ea5e0a160fa" UNIQUE ("authorId", "parentId"), CONSTRAINT "PK_2c299aaf1f903c45ee7e6c7b419" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password_recoveries" ADD CONSTRAINT "FK_db7fec32d882a9412d8081037ae" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_confirmations" ADD CONSTRAINT "FK_930e1d7c0171d23e5535b1e3873" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_55d9c167993fed3f375391c8e31" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_likes" ADD CONSTRAINT "FK_13cc94053492d02340fe803ca43" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_likes" ADD CONSTRAINT "FK_ca828dd7dc4793b7462e74f9f43" FOREIGN KEY ("parentId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_ee98d772a65959a5d42c7627574" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_d39916edd6f1347d892c86dc3b8" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_d39916edd6f1347d892c86dc3b8"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_ee98d772a65959a5d42c7627574"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "post_likes" DROP CONSTRAINT "FK_ca828dd7dc4793b7462e74f9f43"`);
        await queryRunner.query(`ALTER TABLE "post_likes" DROP CONSTRAINT "FK_13cc94053492d02340fe803ca43"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_55d9c167993fed3f375391c8e31"`);
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_e8a5d59f0ac3040395f159507c6"`);
        await queryRunner.query(`ALTER TABLE "email_confirmations" DROP CONSTRAINT "FK_930e1d7c0171d23e5535b1e3873"`);
        await queryRunner.query(`ALTER TABLE "password_recoveries" DROP CONSTRAINT "FK_db7fec32d882a9412d8081037ae"`);
        await queryRunner.query(`DROP TABLE "comment_likes"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "blogs"`);
        await queryRunner.query(`DROP TABLE "post_likes"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "email_confirmations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "password_recoveries"`);
    }

}
