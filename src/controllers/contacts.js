import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";

import createHttpError from "http-errors";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";


const uploadPhoto = async (file) => {
  const useCloudinary = getEnvVar("ENABLE_CLOUDINARY", "false") === "true";
  return useCloudinary
    ? await saveFileToCloudinary(file)
    : await saveFileToUploadDir(file);
};

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId,
    });

    res.json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const userId = req.user._id;

    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        "Missing required fields: name, phoneNumber, or contactType"
      );
    }

    let photoUrl;
    if (req.file) {
      photoUrl = await uploadPhoto(req.file);
    }

    const newContact = await createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: "Successfully created a contact!",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updates = { ...req.body };

    if (req.file) {
      const photoUrl = await uploadPhoto(req.file);
      updates.photo = photoUrl;
    }

    if (Object.keys(updates).length === 0) {
      throw createHttpError(
        400,
        "At least one field must be provided for update"
      );
    }

    const updatedContact = await updateContact(contactId, userId, updates);

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updates = { ...req.body };

    if (req.file) {
      const photoUrl = await uploadPhoto(req.file);
      updates.photo = photoUrl;
    }

    const updatedContact = await updateContact(contactId, userId, updates);

    if (!updatedContact) {
      throw createHttpError(404, "Contact not found");
    }

    res.json({
      status: 200,
      message: "Successfully patched a contact!",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};
