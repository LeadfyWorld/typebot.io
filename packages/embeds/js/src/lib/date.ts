export const formatMessageDate = (createdAt: string | null) => {
  if (!createdAt) {
    return null;
  }

  const createdDate = new Date(createdAt);
  const now = new Date();

  const isToday =
    createdDate.getDate() === now.getDate() &&
    createdDate.getMonth() === now.getMonth() &&
    createdDate.getFullYear() === now.getFullYear();

  const time = createdDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    // hour12: false, // force 24-hour format
  });

  if (isToday) {
    return `${time}h`;
  }

  const date = createdDate.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
  });

  return `${date} ${time}h`;
};

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // If less than 10 minutes → "Recently"
  if (minutes < 10) {
    return "recently";
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (minutes < 60) return rtf.format(-minutes, "minute");
  if (hours < 24) return rtf.format(-hours, "hour");
  if (days < 30) return rtf.format(-days, "day");
  if (months < 12) return rtf.format(-months, "month");
  return rtf.format(-years, "year");
}

type Schedule = {
  start: string;
  end: string;
  days: string[];
};

export function isDateInSchedule(
  schedules: Schedule[] | null | undefined,
  date: Date,
): boolean {
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" }); // ex: "Wednesday"
  const currentTime = date.getHours() * 60 + date.getMinutes(); // convert current time to minutes

  if (!schedules) {
    return false;
  }

  return schedules.some((schedule) => {
    if (!schedule.days.includes(dayOfWeek)) return false;

    const [startHour, startMinute] = schedule.start.split(":").map(Number);
    const [endHour, endMinute] = schedule.end.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // If the end time is past midnight, handle wrap-around
    if (endMinutes < startMinutes) {
      return currentTime >= startMinutes || currentTime <= endMinutes;
    }

    return currentTime >= startMinutes && currentTime <= endMinutes;
  });
}
