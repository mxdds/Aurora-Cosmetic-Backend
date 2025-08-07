import { Router } from 'express';
import { getAlLContacts, saveContact} from "../controller/contact.controller";

const contactRouter: Router = Router();

contactRouter.get('/all', getAlLContacts); // Get all contacts
contactRouter.post('/save', saveContact); // Save a new contact
export default contactRouter;