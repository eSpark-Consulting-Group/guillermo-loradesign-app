export const formatDate = (timestamp: any): string => {
  const now = new Date(); 
  const fullDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    timestamp.hour,
    timestamp.minute,
    timestamp.second
  );

  return `${(fullDate.getMonth() + 1).toString().padStart(2, "0")}/${fullDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${fullDate.getFullYear()}`;
};