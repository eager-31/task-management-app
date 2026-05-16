export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidRole = (role) => {
  return ["USER", "ADMIN"].includes(role);
};

export const isValidStatus = (status) => {
  return ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status);
};

export const isValidPriority = (priority) => {
  return ["LOW", "MEDIUM", "HIGH"].includes(priority);
};