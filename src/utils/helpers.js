/**
 * Generate a unique ticket ID
 * Format: DL-XXXX (where XXXX is incremental number)
 * @returns {string} Generated ticket ID
 */
function generateTicketID() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const ticketNumber = (timestamp % 10000 + random) % 10000;
  return `DL-${String(ticketNumber).padStart(4, '0')}`;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate PIN code (6 digits)
 * @param {string} pin - PIN code to validate
 * @returns {boolean} Whether PIN is valid
 */
function validatePIN(pin) {
  const pinRegex = /^\d{6}$/;
  return pinRegex.test(pin);
}

/**
 * Validate mobile number (10 digits)
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} Whether mobile is valid
 */
function validateMobile(mobile) {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Clean phone number (remove + and spaces)
 * @param {string} phone - Phone number to clean
 * @returns {string} Cleaned phone number
 */
function cleanPhoneNumber(phone) {
  return phone.replace(/[\s+]/g, '');
}

module.exports = {
  generateTicketID,
  validateEmail,
  validatePIN,
  validateMobile,
  formatDate,
  cleanPhoneNumber
};
