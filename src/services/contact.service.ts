import Contact from "../models/contact.model";
import { ContactDtoe } from "../dto/contact.dto";

export const getAllContacts = async (): Promise<ContactDto[]> => {
    try {
        const contacts = await Contact.find();
        return contacts;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw new Error("Failed to fetch contacts");
    }

};

export const saveContact = async (contactData: ContactDto): Promise<ContactDtoe> => {
    try {
        console.log("Received contact data:", contact);
        const validationError = validateContact(contact);
        if (validationError) {
            throw new Error(validationError);
        }

        const newContact = new Contact((contact);
        return await newContact.save();
    } catch (error) {
        console.error("Error saving contact:", error);
        throw new Error("Failed to save contact");
    }
};

export const validateContact = (contact: ContactDto): string | null => {
    if (!contact.email || !contact.message) {
        return "Name, email and message are required fields.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
        return "Invalid email format.";
    }
    return null;
};