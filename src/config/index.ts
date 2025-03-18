import { IDatabaseConfig, databaseConfig } from './database.config';
import { IJwtConfig, jwtConfig } from './jwt.config';
import { NodeEnv } from '../shared/enums/node-env.enum';

export interface IConfig {
  env: string;
  port: number;
  host: string;
  logLevel: string;
  clustering: string;
  database: IDatabaseConfig;
  jwt: IJwtConfig;
  emailUser: string;
  emailPassword: string;
  emailHost: string;
  emailPort: string;
  emailFromName: string;
  emailDebug: string;
  emailService: string;
}

export const configuration = (): Partial<IConfig> => ({
  env: process.env.NODE_ENV || NodeEnv.DEVELOPMENT,
  port: parseInt(process.env.PORT, 10) || 3009,
  host: process.env.HOST || '127.0.0.1',
  logLevel: process.env.LOG_LEVEL,
  clustering: process.env.CLUSTERING,
  database: databaseConfig(),
  jwt: jwtConfig(),
  emailUser: process.env.EMAIL_AUTH_USER,
  emailPassword: process.env.EMAIL_AUTH_PASSWORD,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailFromName: process.env.EMAIL_FROM,
  emailDebug: process.env.EMAIL_DEBUG,
  emailService: process.env.EMAIL_SERVICE,
});
