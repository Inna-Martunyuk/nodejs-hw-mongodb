import { ContactsCollections } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "name",
  filter ={},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollections.find();

  if (filter.type) {
    contactsQuery.where("contactType").equals(filter.type);
  };
  if (filter.isFavourite) {
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


export const getContactById = async (contactId) => {
    const contact = await ContactsCollections.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollections.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload) => {
  const updatedContact = await ContactsCollections.findByIdAndUpdate(
    contactId,
    payload,
    { new: true }
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollections.findOneAndDelete({ _id: contactId });
  return contact;
};
