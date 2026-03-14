// src/utils/helpers.js

/** Generate a unique id */
export const uid = () => Date.now() + Math.random();

/** Format a date string to "11 Mar" style */
export const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return d;
  }
};

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Get initials from a full name */
export const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/** Get hour-based greeting */
export const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};
