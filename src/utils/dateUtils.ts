
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
  
  // 프로젝트 시작일 기준으로 달 계산
  const startYear = start.getFullYear();
  const startMonth = start.getMonth(); // 0-based (6월 = 5)
  
  const currentYear = current.getFullYear();
  const currentMonth = current.getMonth();
  
  // 년도 차이를 고려한 월 계산
  const monthDiff = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  
  return monthDiff + 1; // 1달부터 시작
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
