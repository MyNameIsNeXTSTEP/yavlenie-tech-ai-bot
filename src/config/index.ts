import 'dotenv/config';      

const environment = process.env.NODE_ENV || 'development';

export * from './apiConfig';
export * from './botConfig';
export * from './loggerConfig';

export const appConfig = {
  environment,
  isProduction: environment === 'production',
  isDevelopment: environment === 'development'
};
