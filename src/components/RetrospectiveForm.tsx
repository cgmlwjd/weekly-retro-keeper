import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RetrospectiveFormData, Author } from '@/types/retrospective';
import { calculateDayCount, calculateWeekNumber, getTodayString, formatDate, getMonthName } from '@/utils/dateUtils';
import { Calendar, User, FileText, CheckCircle, AlertCircle, Target, StickyNote } from 'lucide-react';

interface RetrospectiveFormProps {
  onSubmit: (data: RetrospectiveFormData) => void;
  onCancel: () => void;
}

export function RetrospectiveForm({ onSubmit, onCancel }: RetrospectiveFormProps) {
  const today = getTodayString();
  const dayCount = calculateDayCount(today);
  const weekNumber = calculateWeekNumber(today);
  const formattedDate = formatDate(today);

  const [formData, setFormData] = useState<RetrospectiveFormData>({
    author: '최희정',
    summary: '',
    keep: '',
    problem: '',
    try: '',
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof RetrospectiveFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-strong">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {getMonthName(weekNumber)} 회고 작성
          </CardTitle>
          <p className="text-primary-foreground/80">
            D+{dayCount}일차 - {formattedDate}
          </p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Author Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                작성자
              </Label>
              <Select
                value={formData.author}
                onValueChange={(value: Author) => handleInputChange('author', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="최희정">최희정</SelectItem>
                  <SelectItem value="김창훈">김창훈</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                요약 (Summary)
              </Label>
              <Textarea
                placeholder="한 달의 업무를 간단히 요약해주세요..."
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>

            {/* Keep */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-success">
                <CheckCircle className="h-4 w-4" />
                Keep (잘한 점)
              </Label>
              <Textarea
                placeholder="계속 유지하고 싶은 좋은 점들을 적어주세요..."
                value={formData.keep}
                onChange={(e) => handleInputChange('keep', e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>

            {/* Problem */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                Problem (문제점)
              </Label>
              <Textarea
                placeholder="개선이 필요한 문제점들을 적어주세요..."
                value={formData.problem}
                onChange={(e) => handleInputChange('problem', e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>

            {/* Try */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-warning">
                <Target className="h-4 w-4" />
                Try (시도할 점)
              </Label>
              <Textarea
                placeholder="다음에 시도해볼 개선 방안들을 적어주세요..."
                value={formData.try}
                onChange={(e) => handleInputChange('try', e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>

            {/* Memo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                자유 메모
              </Label>
              <Textarea
                placeholder="기타 메모할 내용이 있다면 자유롭게 적어주세요..."
                value={formData.memo}
                onChange={(e) => handleInputChange('memo', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                회고 저장
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
