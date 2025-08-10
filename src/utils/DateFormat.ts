export const formatDate = (timestamp: any): string => {
  const now = new Date();
  const adjustedDate = new Date(
    Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      timestamp.hour + 7,
      timestamp.minute,
      timestamp.second
    )
  );
  const formattedDate = `${(adjustedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${adjustedDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${adjustedDate.getFullYear()}`;

  const formattedTime = adjustedDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return `${formattedDate}\n(${formattedTime})`;
};
