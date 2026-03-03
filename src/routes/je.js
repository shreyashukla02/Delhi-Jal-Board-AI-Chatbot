const express = require('express');
const router = express.Router();
const { 
  updateTicketStatus, 
  getTicketDetails, 
  getAllTickets 
} = require('../controllers/jeController');

// POST /je/update-status - Update ticket status and notify user
router.post('/update-status', updateTicketStatus);

// GET /je/ticket/:ticketID - Get specific ticket details
router.get('/ticket/:ticketID', getTicketDetails);

// GET /je/tickets - Get all tickets with optional filters
router.get('/tickets', getAllTickets);

module.exports = router;
