import createHttpError from "http-errors";
import swaggerUI from "swagger-ui-express";
import fs from "node:fs";
import yaml from "js-yaml";
import { SWAGGER_PATH } from "../constants/index.js";

export const swaggerDocs = () => {
  try {
    const fileContent = fs.readFileSync(SWAGGER_PATH, "utf8");
    const swaggerDoc = yaml.load(fileContent);

    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.error("Swagger docs load error:", err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load Swagger YAML documentation"));
  }
};
