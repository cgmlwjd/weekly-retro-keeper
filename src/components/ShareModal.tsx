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
import { Share2, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
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

  const shareToFacebook = () => {
    const shareText = createShareText('long');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    const shareText = createShareText('short');
    const fullText = `${shareText}\n\n${url}`;
    // Twitter has character limit, so we need to be careful
    const maxLength = 280;
    let finalText = fullText;
    if (finalText.length > maxLength) {
      const availableLength = maxLength - url.length - 5; // 5 for "\n\n"
      const truncatedShare = shareText.substring(0, availableLength - 3) + '...';
      finalText = `${truncatedShare}\n\n${url}`;
    }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(finalText)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const shareText = createShareText('long');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(shareText)}`, '_blank');
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
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={shareToFacebook} 
              className="gap-2 h-12"
            >
              <Facebook className="h-5 w-5 text-blue-600" />
              <span>Facebook</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={shareToTwitter} 
              className="gap-2 h-12"
            >
              <Twitter className="h-5 w-5 text-sky-500" />
              <span>Twitter</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={shareToLinkedIn} 
              className="gap-2 h-12"
            >
              <Linkedin className="h-5 w-5 text-blue-700" />
              <span>LinkedIn</span>
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