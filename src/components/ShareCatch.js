import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ShareCatch({ catchItem }) {
  const { toast } = useToast();
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
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: "Link copied",
            description: "The catch link has been copied to your clipboard.",
          });
        }).catch(() => {
          toast({
            title: "Copy failed",
            description: "Failed to copy the link. Please try again.",
            variant: "destructive",
          });
        });
        return;
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
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => handleShare('default')} aria-label="Share catch">
        <Share2 className="mr-2 h-4 w-4" /> Share
      </Button>
      <Button variant="outline" onClick={() => handleShare('facebook')} aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={() => handleShare('twitter')} aria-label="Share on Twitter">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn">
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={() => handleShare('copy')} aria-label="Copy share link">
        <Link className="h-4 w-4" />
      </Button>
    </div>
  );
}