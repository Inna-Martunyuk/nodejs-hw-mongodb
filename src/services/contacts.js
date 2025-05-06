import { ContactsCollections } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollections.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await ContactsCollections.findById(contactId);
    return contact;
};
