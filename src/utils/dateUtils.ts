
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
  
  // 프로젝트 시작일부터 현재 날짜까지의 월 수 계산
  const startYear = start.getFullYear();
  const startMonth = start.getMonth(); // 5 (6월은 인덱스 5)
  const startDay = start.getDate(); // 17
  
  const currentYear = current.getFullYear();
  const currentMonth = current.getMonth();
  const currentDay = current.getDate();
  
  // 년도 차이를 고려한 총 월 수
  let monthDiff = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  
  // 시작일(17일) 이후인지 확인
  if (currentDay >= startDay) {
    monthDiff++;
  }
  
  // 최소 1달부터 시작
  return Math.max(1, monthDiff);
}

export function getMonthName(monthNumber: number): string {
  return `${monthNumber}달`;
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
