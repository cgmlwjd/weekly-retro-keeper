
-- retrospectives 테이블에 피드백 컬럼 추가
ALTER TABLE public.retrospectives 
ADD COLUMN feedback TEXT;
