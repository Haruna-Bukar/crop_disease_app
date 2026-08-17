// Shared "how long ago" formatter, used anywhere a scan or record's
// timestamp needs to show as plain language instead of a raw date.
export function timeAgo(dateOrIsoString) {
  if (!dateOrIsoString) return "";
  const date =
    dateOrIsoString instanceof Date
      ? dateOrIsoString
      : new Date(dateOrIsoString);

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
