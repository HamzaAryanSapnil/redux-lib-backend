
import path from 'path'
import dotenv from 'dotenv';

dotenv.config({path: path.join(process.cwd(), ".env")});

export default {
  node_env: process.env.NODE_ENV,
  db_url: process.env.DB_URL,
  port: process.env.PORT,
};