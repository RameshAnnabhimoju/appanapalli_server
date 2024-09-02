import { configDotenv } from "dotenv";
configDotenv();
export const appConfig = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
};
