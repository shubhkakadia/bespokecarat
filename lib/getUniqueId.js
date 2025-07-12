const { uid } = require("rand-token");

export const getUniqueId = (length) => {
  return uid(length);
};
