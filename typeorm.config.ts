import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { ENVIRONMENTS } from './src/constants';

const env = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;
const envFile = `.env.${env}`;

config({
  path: path.resolve(__dirname, 'src/env', envFile),
  override: true,
});

console.log(`Loading migrations with: ${envFile}`);
console.log(
  `POSTGRESQL_URL: ${process.env.POSTGRESQL_URL ? '✓ Set' : '✗ Not set'}`,
);

export default new DataSource({
  url: process.env.POSTGRESQL_URL,
  type: 'postgres',
  migrations: ['migrations/*.ts'],
  entities: ['src/**/*.entity.ts'],
  logging: true,
});
