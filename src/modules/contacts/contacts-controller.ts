import { Request, Response } from "express";
import { CreateContactService } from "./services/create-contact-service";
import { DeleteContactService } from "./services/delete-contact-service";
import { GetContactsService } from "./services/get-contacts-service";
import { GetOneContactService } from "./services/get-one-contact-service";
import { UpdateContactService } from "./services/update-contact-service";

export class ContactsController {
  createContact = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    const contactID = await new CreateContactService().execute({ ...req.body, userID });
    res.json({ message: "Contact successfully created.", contactID });
  };

  getOneContact = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    const contactID = req.params.contactID;
    const contact = await new GetOneContactService().execute({ userID, contactID });
    res.json({ contact });
  };

  getContacts = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    const contacts = await new GetContactsService().execute({ ...req.body, userID });
    res.json({ contacts });
  };

  updateContact = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    const contactID = req.params.contactID;
    await new UpdateContactService().execute({ ...req.body, userID, contactID });
    res.json({ message: "Contact successfully updated." });
  };

  deleteContact = async (req: Request, res: Response) => {
    const userID = (req as any).userID;
    const contactID = req.params.contactID;
    await new DeleteContactService().execute({ userID, contactID });
    res.json({ message: "Contact successfully deleted." });
  };
}
