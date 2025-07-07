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
}

export default function ShareModal({ url, title, author }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = `${title} by ${author}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "링크가 복사되었습니다",
        description: "클립보드에 회고 링크가 복사되었습니다.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
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
              <span>{copied ? '복사됨' : '링크 복사'}</span>
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