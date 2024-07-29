import Router from "express-promise-router";
import { withAuthMiddleware } from "../../middlewares/with-auth-middleware";
import { ContactsController } from "./contacts-controller";

const contactsRouter = Router();
const contactsController = new ContactsController();

contactsRouter.post("/contacts", withAuthMiddleware, contactsController.createContact);
contactsRouter.get("/contacts/:contactID", withAuthMiddleware, contactsController.getOneContact);
contactsRouter.get("/contacts", withAuthMiddleware, contactsController.getContacts);
contactsRouter.patch("/contacts/:contactID", withAuthMiddleware, contactsController.updateContact);
contactsRouter.delete("/contacts/:contactID", withAuthMiddleware, contactsController.deleteContact);

export { contactsRouter };
