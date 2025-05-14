import { ContactsCollections } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollections.find();
    return contacts;
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
