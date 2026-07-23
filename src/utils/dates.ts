export const toDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const todayStr = (): string => toDateStr(new Date());

export const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const yesterdayStr = (): string => toDateStr(addDays(new Date(), -1));

export const daysBetween = (dateStrA: string, dateStrB: string): number => {
  const a = new Date(dateStrA + 'T00:00:00');
  const b = new Date(dateStrB + 'T00:00:00');
  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const formatFriendlyDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = todayStr();
  const yesterday = yesterdayStr();
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const formatDateTime = (isoStr: string): string => {
  const d = new Date(isoStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getLastNDates = (n: number): string[] => {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(toDateStr(addDays(new Date(), -i)));
  }
  return out;
};

export const getWeekdayLabel = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
};

export const startOfMonthStr = (): string => {
  const d = new Date();
  d.setDate(1);
  return toDateStr(d);
};

export const isOverdue = (dueDate: string | null): boolean => {
  if (!dueDate) return false;
  return dueDate < todayStr();
};
