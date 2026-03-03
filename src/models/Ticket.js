const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
    default: 'OPEN'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  assignedJE: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JuniorEngineer',
    default: null
  },
  // Grievance Details
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default: ''
  },
  grievanceAddress: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  userResidentialAddress: {
    type: String,
    required: true
  },
  // Additional tracking
  statusHistory: [{
    status: String,
    remarks: String,
    updatedAt: {
      type: Date,
      default: Date.now
    },
    updatedBy: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
