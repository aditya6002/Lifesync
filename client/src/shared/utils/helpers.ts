

export const uid = (): string =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const fmtDate = (d: string): string => {
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return d;
  }
};

export const today = (): string =>
  new Date().toISOString().slice(0, 10);

export const initials = (name = ""): string =>
  name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

export const greeting = (): string => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export const timeAgo = (date: string): string => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return fmtDate(date);
};
