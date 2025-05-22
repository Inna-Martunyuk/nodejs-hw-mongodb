import createHttpError from "http-errors";

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const formattedErrors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    const httpError = createHttpError(400, "Validation error", {
      errors: formattedErrors,
    });

    next(httpError);
  }
};
