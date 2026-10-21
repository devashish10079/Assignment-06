import Ticket from "../models/Ticket.js";

export const getTickets = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "customer") {
      query.customer = req.user.id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.department) {
      query.department = req.query.department;
    }

    const tickets = await Ticket.find(query)
      .populate("customer", "name email")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "name email")
      .populate("department", "name");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (req.user.role === "customer" && ticket.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this ticket"
      });
    }

    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority, department } = req.body;

    if (!title || !description || !category || !department) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required ticket fields"
      });
    }

    const ticketNumber = `TICK-${Date.now().toString().slice(-6)}`;

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      category,
      priority: priority || "Medium",
      department,
      customer: req.user.id,
      status: "Open"
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("customer", "name email")
      .populate("department", "name");

    res.status(201).json({
      success: true,
      ticket: populatedTicket
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (req.user.role === "customer") {
      if (ticket.customer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this ticket"
        });
      }

      if (req.body.status === "Open" && (ticket.status === "Resolved" || ticket.status === "Closed")) {
        if (ticket.reopenCount >= 1) {
          return res.status(400).json({
            success: false,
            message: "Ticket can only be reopened once"
          });
        }
        ticket.status = "Open";
        ticket.reopenCount += 1;
        ticket.resolvedAt = null;
      } else if (ticket.status === "Open") {
        if (req.body.title) ticket.title = req.body.title;
        if (req.body.description) ticket.description = req.body.description;
        if (req.body.category) ticket.category = req.body.category;
        if (req.body.priority) ticket.priority = req.body.priority;
      } else {
        return res.status(400).json({
          success: false,
          message: "Cannot modify a resolved or closed ticket except to reopen"
        });
      }
    } else if (req.user.role === "admin") {
      if (req.body.status) {
        ticket.status = req.body.status;
        if (req.body.status === "Resolved" || req.body.status === "Closed") {
          ticket.resolvedAt = new Date();
        } else {
          ticket.resolvedAt = null;
        }
      }
      if (req.body.priority) ticket.priority = req.body.priority;
      if (req.body.department) ticket.department = req.body.department;
    }

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate("customer", "name email")
      .populate("department", "name");

    res.status(200).json({
      success: true,
      ticket: updated
    });
  } catch (error) {
    next(error);
  }
};
