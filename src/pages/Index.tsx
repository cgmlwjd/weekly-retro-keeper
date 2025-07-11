import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRetrospectives } from '@/hooks/useRetrospectives';
import { RetrospectiveForm } from '@/components/RetrospectiveForm';
import { RetrospectiveCard } from '@/components/RetrospectiveCard';
import { RetrospectiveFormData } from '@/types/retrospective';
import { calculateDayCount, calculateWeekNumber, getTodayString, getMonthName } from '@/utils/dateUtils';
import { Plus, Calendar, TrendingUp, Users, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { retrospectives, isLoading, error, addRetrospective, deleteRetrospective, getRetrospectivesByWeek } = useRetrospectives();
  const [showForm, setShowForm] = useState(false);

  const today = getTodayString();
  const currentDayCount = calculateDayCount(today);
  const currentWeek = calculateWeekNumber(today);
  const retrospectivesByWeek = getRetrospectivesByWeek();
  const weekNumbers = Object.keys(retrospectivesByWeek).map(Number).sort((a, b) => b - a);

  const handleFormSubmit = async (formData: RetrospectiveFormData) => {
    try {
      const newRetrospective = await addRetrospective(formData);
      setShowForm(false);
      toast({
        title: "회고가 저장되었습니다! 🎉",
        description: `${newRetrospective.week}달 D+${newRetrospective.day_count}일차 회고가 성공적으로 저장되었습니다.`,
      });
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "회고 저장 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleViewRetrospective = (id: string) => {
    navigate(`/retrospective/${id}`);
  };

  const handleDeleteRetrospective = (id: string) => {
    if (window.confirm('정말로 이 회고를 삭제하시겠습니까?')) {
      deleteRetrospective(id);
      toast({
        title: "회고가 삭제되었습니다",
        description: "선택한 회고가 성공적으로 삭제되었습니다.",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              📝 팀 회고 관리 시스템
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-6">
              월별로 체계적인 회고를 관리하고 성장의 발자취를 남겨보세요
            </p>
            
            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">현재 달</span>
                </div>
                <div className="text-2xl font-bold">{getMonthName(currentWeek)}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">진행 일수</span>
                </div>
                <div className="text-2xl font-bold">D+{currentDayCount}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">총 회고</span>
                </div>
                <div className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${retrospectives.length}개`}
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border border-white/30"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              새 회고 작성
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>회고 데이터를 불러오는 중...</span>
          </div>
        ) : retrospectives.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center shadow-soft">
            <CardContent className="pt-8 pb-8">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">첫 번째 회고를 작성해보세요!</h3>
              <p className="text-muted-foreground mb-6">
                팀의 성장과 발전을 위한 회고를 시작해보세요.
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                회고 작성하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {weekNumbers.map(weekNumber => (
              <div key={weekNumber} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{getMonthName(weekNumber)} 회고</h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    {retrospectivesByWeek[weekNumber].length}개
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {retrospectivesByWeek[weekNumber].map(retrospective => (
                    <RetrospectiveCard
                      key={retrospective.id}
                      retrospective={retrospective}
                      onView={handleViewRetrospective}
                      onDelete={handleDeleteRetrospective}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <RetrospectiveForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
