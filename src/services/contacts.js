import { ContactsCollections } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";
import mongoose from "mongoose";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "name",
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollections.find({ userId });

  if (filter.type) {
    contactsQuery.where("contactType").equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const contactsCount = await ContactsCollections.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactsCollections.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactsCollections.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new Error('Invalid contactId');
  }

  return ContactsCollections.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true }
  );
};

export const deleteContact = async (contactId, userId) => {
  return ContactsCollections.findOneAndDelete({ _id: contactId, userId });
};
