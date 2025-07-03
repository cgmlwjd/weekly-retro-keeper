export const PROJECT_START_DATE = '2025-06-17';

export function calculateDayCount(currentDate: string): number {
  const start = new Date(PROJECT_START_DATE);
  const current = new Date(currentDate);
  
  let count = 0;
  const tempDate = new Date(start);
  
  while (tempDate <= current) {
    const dayOfWeek = tempDate.getDay();
    // Monday = 1, Tuesday = 2, ..., Friday = 5 (exclude weekends)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      count++;
    }
    tempDate.setDate(tempDate.getDate() + 1);
  }
  
  return count;
}

export function calculateWeekNumber(currentDate: string): number {
  const start = new Date(PROJECT_START_DATE);
  const current = new Date(currentDate);
  
  const timeDiff = current.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.ceil((daysDiff + 1) / 7);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '-').replace(/ /g, '').slice(0, -1);
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}