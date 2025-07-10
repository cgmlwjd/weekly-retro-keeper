
-- retrospectives 테이블에 대한 RLS 정책 생성
-- 모든 사용자가 회고를 조회할 수 있도록 허용
CREATE POLICY "Anyone can view retrospectives" ON public.retrospectives
FOR SELECT USING (true);

-- 모든 사용자가 회고를 생성할 수 있도록 허용
CREATE POLICY "Anyone can insert retrospectives" ON public.retrospectives
FOR INSERT WITH CHECK (true);

-- 모든 사용자가 회고를 업데이트할 수 있도록 허용
CREATE POLICY "Anyone can update retrospectives" ON public.retrospectives
FOR UPDATE USING (true);

-- 모든 사용자가 회고를 삭제할 수 있도록 허용
CREATE POLICY "Anyone can delete retrospectives" ON public.retrospectives
FOR DELETE USING (true);
