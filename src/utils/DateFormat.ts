export const formatDate = (timestamp: any): string => {
  const now = new Date(); 
  const utcDate = new Date(Date.UTC(now.getFullYear(),
  now.getMonth(),
  now.getDate(), timestamp.hour, timestamp.minute, timestamp.second));
  const formattedDate = `${(utcDate.getMonth() + 1).toString().padStart(2, "0")}/${utcDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${utcDate.getFullYear()}`;

  const formattedTime = utcDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, 
  });

  return `${formattedDate}\n(${formattedTime})`;
};
