const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');

// Runs every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const appointments = await Appointment.find({
    date: {
      $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
      $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
    },
    status: 'confirmed'
  }).populate('user agent property');

  appointments.forEach(async appointment => {
    try {
      await new sendEmail({
        email: appointment.user.email,
        subject: 'Appointment Reminder',
        message: `You have an appointment tomorrow at ${appointment.time} for ${appointment.property.title}`
      }).send('appointmentReminder');

      await new sendEmail({
        email: appointment.agent.email,
        subject: 'Appointment Reminder',
        message: `You have an appointment tomorrow at ${appointment.time} for ${appointment.property.title} with ${appointment.user.name}`
      }).send('appointmentReminder');
    } catch (err) {
      console.error(`Error sending reminder for appointment ${appointment._id}:`, err);
    }
  });
});