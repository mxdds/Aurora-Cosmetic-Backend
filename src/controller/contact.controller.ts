import { Request, Response } from 'express';
import * as contactService from '../service/contact.service';
export const getAllContacts = (req: Request, res: Response) =>{
    try {
        const contacts = contactService.getAllContacts();
        res.status(200).json(contacts);
    }  catch (error) {
        console.log("Error retrieving contacts:", error);
        res.status(500).json({ message: "Failed to retrieve contacts", error: error.message });
    }
};

export const saveContact = async (req: Request, res: Response) => {
console.log('Received contact data:', req.body);
const contact = req.body;
const validationError = contactService.validateContact(contact);
if (validationError) {
    res.status(400).json({ error: validationError });
    return;
}
try{
    const savedContact = await contactService.saveContact(contact);
    res.status(201).json(savedContact);
} catch(error) {
    console.log('Error saving contact:', error);
    res.status(500).json({ message: "Failed to save contact", error: error.message });
 }
};