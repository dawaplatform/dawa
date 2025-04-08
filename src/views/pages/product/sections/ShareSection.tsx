'use client';

import React from 'react';
import {
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
  FaLink,
  FaXTwitter,
} from 'react-icons/fa6';
import { toast } from 'sonner';
import { encrypt } from '@/@core/utils/crypto';

interface ShareSectionProps {
  productId: string;
  url?: string;
  title: string;
  description?: string;
}

const ShareSection: React.FC<ShareSectionProps> = ({
  productId,
  url,
  title,
  description = '',
}) => {
  // Encrypt the productId.
  const encryptedId = encrypt(productId);

  // Build a base share URL. If an external URL is not provided,
  // use the current origin with a query parameter "p" containing the encrypted productId.
  const baseShareUrl =
    url ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/prod?p=${encodeURIComponent(encryptedId)}`
      : '');

  // Define the share links for various platforms.
  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      bgColor: 'bg-blue-100',
      hoverBgColor: 'hover:bg-blue-200',
      textColor: 'text-blue-600',
      getShareUrl: () =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          baseShareUrl,
        )}`,
    },
    {
      name: 'X',
      icon: FaXTwitter,
      bgColor: 'bg-gray-100',
      hoverBgColor: 'hover:bg-gray-200',
      textColor: 'text-black',
      getShareUrl: () =>
        `https://x.com/intent/tweet?text=${encodeURIComponent(
          title,
        )}&url=${encodeURIComponent(baseShareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      bgColor: 'bg-blue-100',
      hoverBgColor: 'hover:bg-blue-200',
      textColor: 'text-blue-700',
      getShareUrl: () =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          baseShareUrl,
        )}`,
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      bgColor: 'bg-green-100',
      hoverBgColor: 'hover:bg-green-200',
      textColor: 'text-green-500',
      getShareUrl: () =>
        `https://wa.me/?text=${encodeURIComponent(`${title} ${baseShareUrl}`)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(baseShareUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link to clipboard');
    }
  };

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, `Share on ${platform}`, 'width=600,height=400');
  };

  return (
    <div className="mt-10 flex items-center space-x-4">
      <span className="font-bold text-gray-800">Share:</span>
      {shareLinks.map((platform) => {
        const Icon = platform.icon;
        return (
          <button
            key={platform.name}
            onClick={() => handleShare(platform.getShareUrl(), platform.name)}
            className={`w-10 h-10 flex items-center justify-center ${platform.bgColor} ${platform.hoverBgColor} rounded-xl transition duration-300`}
            aria-label={`Share on ${platform.name}`}
          >
            <Icon className={platform.textColor} size={18} />
          </button>
        );
      })}
      <button
        onClick={handleCopyLink}
        className="w-10 h-10 flex items-center justify-center bg-orange-100 hover:bg-orange-200 rounded-xl transition duration-300"
        aria-label="Copy Link"
      >
        <FaLink className="text-orange-500" size={18} />
      </button>
    </div>
  );
};

export default ShareSection;
