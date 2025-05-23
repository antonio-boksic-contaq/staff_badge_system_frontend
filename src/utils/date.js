export const parseDateTime = (date) => {
  if (date === undefined) return;
  const dateItems = date.split(" ");
  const switchedDate = dateItems[0].split("/").reverse().join("-");
  return switchedDate + " " + dateItems[1];
};

export const parseItDateTime = (date) => {
  if (date === undefined) return;
  const dateItems = date.split(" ");
  const switchedDate = dateItems[0].split("-").reverse().join("/");
  return dateItems.length > 1
    ? switchedDate + " " + dateItems[1].slice(0, -3)
    : switchedDate;
};

export const parseItDate = (date) => {
  if (date === undefined) return;
  const dateItems = date.split(" ");
  const switchedDate = dateItems[0].split("-").reverse().join("/");
  return switchedDate;
};

export const parseDate = (date) => {
  if (date === undefined) return;
  const dateItems = date.split(" ");
  const switchedDate = dateItems[0].split("-").reverse().join("/");
  return switchedDate;
};

export const parseHour = (date) => {
  if (date === undefined) return;
  const dateItems = date.split(" ");
  const hour = dateItems[1].slice(0, -3);
  return hour === "00:00" ? "" : hour;
};
