import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRetrospectives } from '@/hooks/useRetrospectives';
import { formatDate } from '@/utils/dateUtils';
import { ArrowLeft, Calendar, User, FileText, CheckCircle, AlertCircle, Target, StickyNote, Trash2 } from 'lucide-react';
import ShareModal from '@/components/ShareModal';
import { useToast } from '@/hooks/use-toast';

export default function RetrospectiveDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getRetrospectiveById, deleteRetrospective } = useRetrospectives();

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
          
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            삭제
          </Button>
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
                    <span>by {retrospective.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Week {retrospective.week}</span>
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
                  <p className="whitespace-pre-wrap">{retrospective.summary}</p>
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
                  <p className="whitespace-pre-wrap">{retrospective.keep}</p>
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
                  <p className="whitespace-pre-wrap">{retrospective.problem}</p>
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
                  <p className="whitespace-pre-wrap">{retrospective.try}</p>
                </div>
              </section>

              {/* Memo (if exists) */}
              {retrospective.memo && (
                <>
                  <Separator />
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <StickyNote className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-semibold">자유 메모</h3>
                    </div>
                    <div className="bg-accent/50 border border-accent p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{retrospective.memo}</p>
                    </div>
                  </section>
                </>
              )}

              <Separator />

              {/* Share Section */}
              <section>
                <ShareModal 
                  url={window.location.href}
                  title={`[D+${retrospective.day_count} 회고] - ${formattedDate}`}
                  author={retrospective.author}
                />
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
