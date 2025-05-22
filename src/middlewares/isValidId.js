import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    const error = createHttpError(400, "Invalid contactId");
    return next(error);
  }

  next();
};
