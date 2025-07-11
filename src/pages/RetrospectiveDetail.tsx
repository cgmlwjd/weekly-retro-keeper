import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRetrospectives } from '@/hooks/useRetrospectives';
import { formatDate, getMonthName } from '@/utils/dateUtils';
import { ArrowLeft, Calendar, User, FileText, CheckCircle, AlertCircle, Target, StickyNote, Trash2, Edit, MessageSquare, Save, X } from 'lucide-react';
import ShareModal from '@/components/ShareModal';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function RetrospectiveDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getRetrospectiveById, deleteRetrospective, updateRetrospective } = useRetrospectives();
  
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [editData, setEditData] = useState({
    summary: '',
    keep: '',
    problem: '',
    try: '',
    memo: ''
  });

  const retrospective = id ? getRetrospectiveById(id) : null;

  if (!retrospective) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">회고를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = formatDate(retrospective.date);
  const partnerName = retrospective.author === '최희정' ? '김창훈' : '최희정';

  const handleDelete = () => {
    if (window.confirm('정말로 이 회고를 삭제하시겠습니까?')) {
      deleteRetrospective(retrospective.id);
      toast({
        title: "회고가 삭제되었습니다",
        description: "선택한 회고가 성공적으로 삭제되었습니다.",
      });
      navigate('/');
    }
  };

  const handleEdit = () => {
    setEditData({
      summary: retrospective.summary,
      keep: retrospective.keep,
      problem: retrospective.problem,
      try: retrospective.try,
      memo: retrospective.memo || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateRetrospective(retrospective.id, editData);
      setIsEditing(false);
      toast({
        title: "회고가 수정되었습니다",
        description: "변경사항이 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "회고 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      summary: '',
      keep: '',
      problem: '',
      try: '',
      memo: ''
    });
  };

  const handleSaveFeedback = async () => {
    try {
      await updateRetrospective(retrospective.id, { feedback });
      setFeedback('');
      toast({
        title: "피드백이 저장되었습니다",
        description: "피드백이 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "피드백 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            갤러리로 돌아가기
          </Button>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <Button 
                variant="outline" 
                onClick={handleEdit}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                수정
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleSaveEdit}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  저장
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  취소
                </Button>
              </div>
            )}
            
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card className="max-w-4xl mx-auto shadow-medium">
          <CardHeader className="bg-gradient-primary text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">
                  [D+{retrospective.day_count} 회고] - {formattedDate}
                </CardTitle>
                <div className="flex items-center gap-4 text-primary-foreground/80">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>by {retrospective.author} with {partnerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{getMonthName(retrospective.week)}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-white/30">
                {new Date(retrospective.created_at).toLocaleString('ko-KR')}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Summary */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">요약 (Summary)</h3>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  {isEditing ? (
                    <Textarea
                      value={editData.summary}
                      onChange={(e) => setEditData(prev => ({ ...prev, summary: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{retrospective.summary}</p>
                  )}
                </div>
              </section>

              <Separator />

              {/* Keep */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h3 className="text-xl font-semibold text-success">Keep (잘한 점)</h3>
                </div>
                <div className="bg-success/5 border border-success/20 p-4 rounded-lg">
                  {isEditing ? (
                    <Textarea
                      value={editData.keep}
                      onChange={(e) => setEditData(prev => ({ ...prev, keep: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{retrospective.keep}</p>
                  )}
                </div>
              </section>

              <Separator />

              {/* Problem */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <h3 className="text-xl font-semibold text-destructive">Problem (문제점)</h3>
                </div>
                <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg">
                  {isEditing ? (
                    <Textarea
                      value={editData.problem}
                      onChange={(e) => setEditData(prev => ({ ...prev, problem: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{retrospective.problem}</p>
                  )}
                </div>
              </section>

              <Separator />

              {/* Try */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-warning" />
                  <h3 className="text-xl font-semibold text-warning">Try (시도할 점)</h3>
                </div>
                <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
                  {isEditing ? (
                    <Textarea
                      value={editData.try}
                      onChange={(e) => setEditData(prev => ({ ...prev, try: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{retrospective.try}</p>
                  )}
                </div>
              </section>

              {/* Memo (if exists or in edit mode) */}
              {(retrospective.memo || isEditing) && (
                <>
                  <Separator />
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <StickyNote className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">자유 메모</h3>
                    </div>
                    <div className="bg-accent/50 border border-accent p-4 rounded-lg">
                      {isEditing ? (
                        <Textarea
                          value={editData.memo}
                          onChange={(e) => setEditData(prev => ({ ...prev, memo: e.target.value }))}
                          className="min-h-[80px]"
                          placeholder="기타 메모할 내용이 있다면 자유롭게 적어주세요..."
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{retrospective.memo}</p>
                      )}
                    </div>
                  </section>
                </>
              )}

              <Separator />

              {/* Feedback Section */}
              {retrospective.author === '최희정' && (
                <>
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <h3 className="text-xl font-semibold text-blue-600">수석님의 피드백</h3>
                    </div>
                    <div className="space-y-4">
                      {retrospective.feedback && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="whitespace-pre-wrap">{retrospective.feedback}</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="feedback">피드백 작성</Label>
                        <Textarea
                          id="feedback"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="피드백을 작성해주세요..."
                          className="min-h-[100px]"
                        />
                        <Button 
                          onClick={handleSaveFeedback}
                          disabled={!feedback.trim()}
                          className="w-full"
                        >
                          피드백 저장
                        </Button>
                      </div>
                    </div>
                  </section>
                  <Separator />
                </>
              )}

              {/* Share Section */}
              <section>
                <ShareModal 
                  url={window.location.href}
                  title={`[D+${retrospective.day_count} 회고] - ${formattedDate}`}
                  author={retrospective.author}
                  summary={retrospective.summary}
                  dayCount={retrospective.day_count}
                />
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
