export function convertStringToTimestamp(timeAgoString) {
  const currentTime = new Date();
  let timestamp;

  if (timeAgoString.includes("second")) {
    const seconds = parseInt(timeAgoString);
    timestamp = currentTime - seconds * 1000;
  } else if (timeAgoString.includes("min")) {
    const minutes = parseInt(timeAgoString);
    timestamp = currentTime - minutes * 60 * 1000;
  } else if (timeAgoString.includes("hour")) {
    const hours = parseInt(timeAgoString);
    timestamp = currentTime - hours * 60 * 60 * 1000;
  } else if (timeAgoString.includes("day")) {
    const days = parseInt(timeAgoString);
    timestamp = currentTime - days * 24 * 60 * 60 * 1000;
  } else if (timeAgoString.includes("week")) {
    const weeks = parseInt(timeAgoString);
    timestamp = currentTime - weeks * 7 * 24 * 60 * 60 * 1000;
  } else if (timeAgoString.includes("month")) {
    const months = parseInt(timeAgoString);
    // Assuming 30 days in a month for simplicity
    timestamp = currentTime - months * 30 * 24 * 60 * 60 * 1000;
  } else if (timeAgoString.includes("year")) {
    const years = parseInt(timeAgoString);
    timestamp = currentTime - years * 12 * 30 * 24 * 60 * 60 * 1000;
  }

  return (new Date(timestamp)).toISOString();
}

// console.log( convertStringToTimestamp())
