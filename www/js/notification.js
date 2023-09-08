document.addEventListener("deviceready", scheduleNewNotification);

function scheduleNewNotification(apptLocation, apptDateTime, reminderTime) {
  // Calculate the reminder time in milliseconds
  const reminderTimeInMs = reminderTime * 60 * 1000;

  // Convert appointment date-time to milliseconds
  const apptTimeInMs = new Date(apptDateTime).getTime();

  // Calculate the time to show the notification
  const notifTimeInMs = apptTimeInMs - reminderTimeInMs;

  // Check if the Cordova local notification plugin is available
  if (
    typeof cordova !== "undefined" &&
    cordova.plugins &&
    cordova.plugins.notification &&
    cordova.plugins.notification.local
  ) {
    // Schedule the notification
    cordova.plugins.notification.local.schedule({
      id: 1,
      title: "New Appointment Reminder",
      text: `You have an appointment at ${apptLocation} in ${reminderTime} minutes.`,
      trigger: { at: new Date(notifTimeInMs) },
    });
  } else {
    console.error("Cordova local notification plugin is not available.");
  }
}