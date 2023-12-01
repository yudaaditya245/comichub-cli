export function convertRizzTime(dateString) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let timestamp;

  if (dateString === "Today") {
    timestamp = today.getTime();
  } else if (dateString === "Yesterday") {
    timestamp = yesterday.getTime();
  } else if (dateString === "Year ago") {
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    timestamp = lastYear.getTime();
  } else {
    // Parse other date formats like '16 Nov', '31 Oct', etc.
    const parts = dateString.split(" ");

    // Handle the case when the date is only in month and day format
    if (parts.length === 2) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const month = monthNames.indexOf(parts[1]);
      const day = parseInt(parts[0], 10);
      const currentYear = today.getFullYear();

      const customDate = new Date(currentYear, month, day);
      timestamp = customDate.getTime();
    }
  }

  // If the format is not recognized, return null or handle accordingly
  return (new Date(timestamp)).toISOString();
}
