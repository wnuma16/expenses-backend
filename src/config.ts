import './env.config';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASS = process.env.DB_PASS || 'Sistemas2020**';
export const DB_NAME = process.env.DB_NAME || 'finance';
export const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';
