import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ShareCatch({ catchItem }) {
  const shareUrl = `${window.location.origin}/catch/${catchItem.id}`;
  const shareText = `Check out my fishing catch at ${catchItem.location}!`;

  const handleShare = (platform) => {
    let url;
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: 'My Fishing Catch',
            text: shareText,
            url: shareUrl,
          }).then(() => {
            toast({
              title: "Shared successfully",
              description: "Your catch has been shared.",
            });
          }).catch(console.error);
        } else {
          toast({
            title: "Sharing not supported",
            description: "Your browser doesn't support native sharing.",
            variant: "destructive",
          });
        }
        return;
    }
    window.open(url, '_blank');
    toast({
      title: "Shared successfully",
      description: `Your catch has been shared on ${platform}.`,
    });
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => handleShare('default')}>
        <Share2 className="mr-2 h-4 w-4" /> Share
      </Button>
      <Button variant="outline" onClick={() => handleShare('facebook')}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={() => handleShare('twitter')}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={() => handleShare('linkedin')}>
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  );
}