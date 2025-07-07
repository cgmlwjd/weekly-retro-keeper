
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Copy, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const { toast } = useToast();

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    onClose();
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    onClose();
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    onClose();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "링크가 복사되었습니다",
        description: "클립보드에 회고 링크가 복사되었습니다.",
      });
      onClose();
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            회고 공유하기
          </DialogTitle>
          <DialogDescription>
            이 회고를 다른 사람들과 공유해보세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* URL Display */}
          <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg">
            <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{url}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Social Share Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              onClick={shareToFacebook}
              className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook className="h-4 w-4 text-white" />
              </div>
              <span className="flex-1 text-left">Facebook에서 공유</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={shareToTwitter}
              className="w-full justify-start gap-3 h-12 hover:bg-sky-50 hover:border-sky-200"
            >
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <Twitter className="h-4 w-4 text-white" />
              </div>
              <span className="flex-1 text-left">Twitter에서 공유</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={shareToLinkedIn}
              className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:border-blue-200"
            >
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <Linkedin className="h-4 w-4 text-white" />
              </div>
              <span className="flex-1 text-left">LinkedIn에서 공유</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
