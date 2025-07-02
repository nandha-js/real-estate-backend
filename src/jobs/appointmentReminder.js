const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Email = require('../utils/sendEmail');

// Runs every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(tomorrow.setHours(0, 0, 0, 0));
  const end = new Date(tomorrow.setHours(23, 59, 59, 999));

  try {
    const appointments = await Appointment.find({
      date: { $gte: start, $lt: end },
      status: 'confirmed'
    }).populate('user agent property');

    for (const appointment of appointments) {
      try {
        // Email to user
        await new Email(appointment.user, '#').send(
          'appointmentReminder',
          `You have an appointment tomorrow at ${appointment.time} for ${appointment.property.title}`
        );

        // Email to agent
        await new Email(appointment.agent, '#').send(
          'appointmentReminder',
          `You have an appointment tomorrow at ${appointment.time} for ${appointment.property.title} with ${appointment.user.name}`
        );
      } catch (err) {
        console.error(`❌ Email error for appointment ${appointment._id}:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Cron job failed:', err);
  }
});
