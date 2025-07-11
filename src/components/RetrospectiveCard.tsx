import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Retrospective } from '@/types/retrospective';
import { formatDate, getMonthName } from '@/utils/dateUtils';
import { Calendar, User, Trash2, Eye } from 'lucide-react';

interface RetrospectiveCardProps {
  retrospective: Retrospective;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RetrospectiveCard({ retrospective, onView, onDelete }: RetrospectiveCardProps) {
  const formattedDate = formatDate(retrospective.date);
  
  // 상대방 이름 계산
  const partnerName = retrospective.author === '최희정' ? '김창훈' : '최희정';

  return (
    <Card className="bg-gradient-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {getMonthName(retrospective.week)} 회고 - {formattedDate}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>by {retrospective.author} with {partnerName}</span>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            <Calendar className="h-3 w-3 mr-1" />
            D+{retrospective.day_count}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-sm text-foreground line-clamp-2">
            <strong>요약:</strong> {retrospective.summary}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-success/10 rounded-md">
              <div className="font-medium text-success mb-1">Keep</div>
              <div className="line-clamp-2 text-muted-foreground">
                {retrospective.keep.slice(0, 50)}...
              </div>
            </div>
            <div className="p-2 bg-destructive/10 rounded-md">
              <div className="font-medium text-destructive mb-1">Problem</div>
              <div className="line-clamp-2 text-muted-foreground">
                {retrospective.problem.slice(0, 50)}...
              </div>
            </div>
            <div className="p-2 bg-warning/10 rounded-md">
              <div className="font-medium text-warning mb-1">Try</div>
              <div className="line-clamp-2 text-muted-foreground">
                {retrospective.try.slice(0, 50)}...
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onView(retrospective.id);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              상세보기
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(retrospective.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
