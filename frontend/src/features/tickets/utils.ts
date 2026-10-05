export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(value));
}

export function initials(email: string) {
  return email.split("@")[0].split(/[._-]/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
