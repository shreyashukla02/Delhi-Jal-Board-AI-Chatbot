const Ticket = require('../models/Ticket');
const UserSession = require('../models/UserSession');
const { sendMessage } = require('../services/whatsappService');
const { getMessage } = require('../utils/locale');
const { formatDate } = require('../utils/helpers');

/**
 * Update ticket status
 * Called by JE/Admin to update ticket status and notify user
 */
async function updateTicketStatus(req, res) {
  try {
    const { ticketID, newStatus, remarks } = req.body;

    // Validate input
    if (!ticketID || !newStatus) {
      return res.status(400).json({
        success: false,
        message: 'ticketID and newStatus are required'
      });
    }

    // Validate status
    const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Find ticket
    const ticket = await Ticket.findOne({ ticketID });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket ${ticketID} not found`
      });
    }

    // Update ticket
    const oldStatus = ticket.status;
    ticket.status = newStatus;
    
    // Add to status history
    ticket.statusHistory.push({
      status: newStatus,
      remarks: remarks || 'No remarks',
      updatedAt: new Date(),
      updatedBy: req.body.updatedBy || 'Admin'
    });
    
    await ticket.save();

    console.log(`✓ Ticket ${ticketID} status updated: ${oldStatus} → ${newStatus}`);

    // Send WhatsApp notification to user
    await notifyUser(ticket, newStatus, remarks);

    res.status(200).json({
      success: true,
      message: 'Ticket updated and user notified successfully',
      data: {
        ticketID: ticket.ticketID,
        oldStatus,
        newStatus,
        remarks: remarks || 'No remarks'
      }
    });

  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Notify user about ticket status update via WhatsApp
 */
async function notifyUser(ticket, newStatus, remarks) {
  try {
    // Get user's phone number from ticket mobile field
    const phoneNumber = ticket.mobile;
    
    // Get user's preferred language from session (if exists)
    const session = await UserSession.findOne({ phoneNumber });
    const language = session?.language || 'en';

    // Build notification message
    const message = getMessage(language, 'ticketUpdateNotification', {
      ticketID: ticket.ticketID,
      status: newStatus,
      remarks: remarks || 'No remarks provided',
      time: formatDate(new Date())
    });

    await sendMessage(phoneNumber, message);
    console.log(`✓ User ${phoneNumber} notified about ticket ${ticket.ticketID} update`);

  } catch (error) {
    console.error('Error notifying user:', error);
  }
}

/**
 * Get ticket details by ID
 */
async function getTicketDetails(req, res) {
  try {
    const { ticketID } = req.params;

    const ticket = await Ticket.findOne({ ticketID }).populate('assignedJE');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket ${ticketID} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

/**
 * Get all tickets with optional filters
 */
async function getAllTickets(req, res) {
  try {
    const { status, department, limit = 50, skip = 0 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;

    const tickets = await Ticket.find(filter)
      .populate('assignedJE')
      .sort({ submissionDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Ticket.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}

module.exports = {
  updateTicketStatus,
  getTicketDetails,
  getAllTickets
};
