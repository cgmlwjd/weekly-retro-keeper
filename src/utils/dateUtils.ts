
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
  // 6월 17일 ~ 7월 16일 = 1달
  // 7월 17일 ~ 8월 16일 = 2달
  // 8월 17일 ~ 9월 16일 = 3달
  
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();
  
  const currentYear = current.getFullYear();
  const currentMonth = current.getMonth();
  const currentDay = current.getDate();
  
  // 년도 차이를 고려한 총 월 수
  let monthDiff = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  
  // 날짜가 시작일보다 이전이면 한 달 빼기
  if (currentDay < startDay) {
    monthDiff--;
  }
  
  // 최소 1달부터 시작
  return Math.max(1, monthDiff + 1);
}

export function getMonthName(monthNumber: number): string {
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  // 프로젝트 시작이 6월이므로 monthNumber를 실제 월로 변환
  const startMonth = 6; // 6월부터 시작
  const actualMonth = ((startMonth - 1 + monthNumber - 1) % 12);
  
  return months[actualMonth];
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
