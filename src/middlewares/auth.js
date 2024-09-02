import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { appConfigs } from "../config/appConfig.js";
dotenv.config();
const { ACCESS_TOKEN_SECRET } = appConfigs;
export default async function auth(request, response, next) {
  try {
    const { authorization } = request.headers;
    if (!!authorization) {
      jwt.verify(authorization, ACCESS_TOKEN_SECRET, (error, client) => {
        if (error) {
          response.status(401).json({
            message: error?.message || "Token Expired",
            isLoggedin: false,
            type: "fail",
          });
        }
        request.client = client;
        next();
      });
    } else {
      return response.status(401).json({
        message: "Unauthorized Access",
        isLoggedin: false,
        type: "fail",
      });
    }
  } catch (error) {
    return response.json({
      message: error.message,
      isLoggedin: false,
      type: "fail",
    });
  }
}
