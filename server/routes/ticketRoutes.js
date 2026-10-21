import express from "express";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket
} from "../controllers/ticketController.js";
import { getComments, addComment } from "../controllers/commentController.js";
import authHandler from "../middleware/authHandler.js";

const router = express.Router();

router.use(authHandler);

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/:id", getTicketById);
router.put("/:id", updateTicket);

router.get("/:ticketId/comments", getComments);
router.post("/:ticketId/comments", addComment);

export default router;
