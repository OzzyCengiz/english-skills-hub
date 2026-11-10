export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

/** The collapse clock starts on day 1 at 06:00. */
export const START_MINUTES = 6 * MINUTES_PER_HOUR;

export function readClock(totalMinutes) {
  const day = Math.floor(totalMinutes / MINUTES_PER_DAY) + 1;
  const minuteOfDay = totalMinutes % MINUTES_PER_DAY;
  return {
    day,
    hour: Math.floor(minuteOfDay / MINUTES_PER_HOUR),
    minute: Math.floor(minuteOfDay % MINUTES_PER_HOUR),
  };
}

export function formatClock(totalMinutes) {
  const { hour, minute } = readClock(totalMinutes);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function isNight(totalMinutes) {
  const { hour } = readClock(totalMinutes);
  return hour >= 20 || hour < 6;
}

export function daysElapsed(totalMinutes) {
  return Math.max(0, (totalMinutes - START_MINUTES) / MINUTES_PER_DAY);
}

