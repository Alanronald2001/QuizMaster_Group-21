import { config } from 'dotenv';
config();

interface EnvConfig {
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    PORT: number;
    NODE_ENV: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const env: EnvConfig = {
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
    PORT: parseInt(getEnvVar('PORT', '5000'), 10),
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};
