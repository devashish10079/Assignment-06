import Comment from "../models/Comment.js";
import Ticket from "../models/Ticket.js";

export const getComments = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (req.user.role === "customer" && ticket.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view comments for this ticket"
      });
    }

    const comments = await Comment.find({ ticket: ticketId })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment message cannot be empty"
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (req.user.role === "customer" && ticket.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to comment on this ticket"
      });
    }

    const comment = await Comment.create({
      ticket: ticketId,
      author: req.user.id,
      message: message.trim()
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name role");

    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    next(error);
  }
};
