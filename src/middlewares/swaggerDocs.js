import createHttpError from "http-errors";
import swaggerUI from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const SWAGGER_YAML_PATH = path.join(process.cwd(), "docs", "openapi.yaml");

export const swaggerDocs = () => {
  try {
    const fileContent = fs.readFileSync(SWAGGER_YAML_PATH, "utf8");
    const swaggerDoc = yaml.load(fileContent); // <-- перетворює YAML на JS-об'єкт

    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.error("Swagger docs load error:", err);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load Swagger YAML documentation"));
  }
};
