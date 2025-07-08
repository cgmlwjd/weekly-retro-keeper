
import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Share2, MessageCircle, BookOpen, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  url: string;
  title: string;
  author: string;
  summary: string;
  dayCount: number;
}

export default function ShareModal({ url, title, author, summary, dayCount }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const createShareText = (platform: 'short' | 'long') => {
    const baseText = `${title} by ${author}`;
    if (platform === 'short') {
      const shortSummary = summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
      return `${baseText}\n\n📝 ${shortSummary}`;
    } else {
      return `${baseText}\n\n📝 요약:\n${summary}\n\n🔗 자세히 보기:`;
    }
  };

  const shareToKakaoTalk = () => {
    const shareText = createShareText('short');
    const fullText = `${shareText}\n\n${url}`;
    // KakaoTalk sharing via URL scheme
    const kakaoUrl = `kakaotalk://share?text=${encodeURIComponent(fullText)}`;
    window.location.href = kakaoUrl;
    
    // Fallback: copy to clipboard if KakaoTalk is not available
    setTimeout(() => {
      navigator.clipboard.writeText(fullText);
      toast({
        title: "카카오톡 공유 준비 완료",
        description: "카카오톡이 열리지 않으면 내용이 클립보드에 복사되었습니다.",
      });
    }, 1000);
  };

  const shareToBlog = () => {
    const shareText = createShareText('long');
    const fullShareContent = `${shareText}\n\n${url}`;
    // Generic blog sharing - copy content and show instructions
    navigator.clipboard.writeText(fullShareContent);
    toast({
      title: "블로그 공유 내용이 복사되었습니다",
      description: "블로그에 붙여넣기 하여 공유해보세요.",
    });
  };

  const copyToClipboard = async () => {
    try {
      const shareText = createShareText('long');
      const fullShareContent = `${shareText}\n\n${url}`;
      await navigator.clipboard.writeText(fullShareContent);
      setCopied(true);
      toast({
        title: "공유 내용이 복사되었습니다",
        description: "요약과 링크가 함께 클립보드에 복사되었습니다.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "공유 내용 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          공유하기
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="text-center">
          <DrawerTitle>회고 공유하기</DrawerTitle>
          <div className="text-sm text-muted-foreground mt-2">
            요약과 링크가 함께 공유됩니다
          </div>
        </DrawerHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={shareToKakaoTalk} 
              className="gap-2 h-12"
            >
              <MessageCircle className="h-5 w-5 text-yellow-500" />
              <span>카카오톡</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={shareToBlog} 
              className="gap-2 h-12"
            >
              <BookOpen className="h-5 w-5 text-green-600" />
              <span>블로그</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={copyToClipboard} 
              className="gap-2 h-12"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span>{copied ? '복사됨' : '전체 복사'}</span>
            </Button>
          </div>
          
          <DrawerClose asChild>
            <Button variant="secondary" className="w-full">
              닫기
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
