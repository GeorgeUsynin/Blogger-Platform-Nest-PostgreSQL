import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DB_TYPE, ENVIRONMENTS, PG_PORT } from '../../constants';
import { CoreConfig } from './core.config';

export const getDbConfig = (coreConfig: CoreConfig): TypeOrmModuleOptions => {
  const isProduction = coreConfig.NODE_ENV === ENVIRONMENTS.PRODUCTION;

  return {
    type: DB_TYPE,
    port: PG_PORT,
    url: coreConfig.POSTGRESQL_URL,
    // host: coreConfig.POSTGRESQL_URL,
    // username: coreConfig.PG_USERNAME,
    // password: coreConfig.PG_PASSWORD,
    // database: coreConfig.DB_NAME_PG,
    autoLoadEntities: !isProduction,
    synchronize: false,
  };
};
