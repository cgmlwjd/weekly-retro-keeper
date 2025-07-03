
-- Create retrospectives table to store team retrospective data
CREATE TABLE public.retrospectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  week INTEGER NOT NULL,
  day_count INTEGER NOT NULL,
  author TEXT NOT NULL CHECK (author IN ('최희정', '김창훈')),
  summary TEXT NOT NULL,
  keep TEXT NOT NULL,
  problem TEXT NOT NULL,
  try TEXT NOT NULL,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger to automatically update updated_at column
CREATE TRIGGER update_retrospectives_updated_at
  BEFORE UPDATE ON public.retrospectives
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_retrospectives_date ON public.retrospectives(date DESC);
CREATE INDEX idx_retrospectives_week ON public.retrospectives(week DESC);
CREATE INDEX idx_retrospectives_author ON public.retrospectives(author);
