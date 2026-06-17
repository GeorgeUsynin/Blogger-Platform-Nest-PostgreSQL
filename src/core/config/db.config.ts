import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DB_TYPE, PG_PORT } from '../../constants';
import { CoreConfig } from './core.config';

export const getDbConfig = (coreConfig: CoreConfig): TypeOrmModuleOptions => ({
  type: DB_TYPE,
  port: PG_PORT,
  url: coreConfig.POSTGRESQL_URL,
  autoLoadEntities: true,
  synchronize: false,
});
