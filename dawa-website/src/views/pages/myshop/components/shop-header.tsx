import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MapPin } from 'lucide-react';
import type React from 'react';
import { FaEnvelope, FaPhone, FaWhatsapp } from 'react-icons/fa';
import type { UserProfile } from '../types/types';

interface ShopHeaderProps {
  user: UserProfile;
  stats: {
    total_items: number;
    available_items: number;
    sold_items: number;
  };
  /** When true, hide the sold stat and message button */
  isAdmin?: boolean;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  user,
  stats,
  isAdmin = false,
}) => (
  <header className="bg-white rounded-xl shadow-md overflow-hidden">
    {/* Profile & Stats Section */}
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar
          className="w-20 h-20 border-4 border-white shadow-lg"
          aria-label="User avatar"
        >
          <AvatarImage
            src={user.profile_picture}
            alt={`${user.user.first_name} ${user.user.last_name}`}
          />
          <AvatarFallback>{user.user.first_name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {`${user.user.first_name} ${user.user.last_name}'s Shop`}
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 cursor-help"
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>{user.address || 'Unknown'}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shop Location</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50">
                <span className="text-blue-600 font-semibold">
                  {stats.total_items}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Total Items</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-50">
                <span className="text-green-600 font-semibold">
                  {stats.available_items}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Available</p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-50">
                  <span className="text-orange-600 font-semibold">
                    {stats.sold_items}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600">Sold</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 ml-auto">
          <Button
            className="bg-[#25D366] hover:bg-[#128C7E] transition-colors duration-200 flex items-center gap-2"
            onClick={() =>
              window.open(`https://wa.me/${user.contact}`, '_blank')
            }
            aria-label="Contact via WhatsApp"
          >
            <FaWhatsapp className="h-4 w-4" />
            <span>WhatsApp</span>
          </Button>
        </div>
      </div>
    </div>

    {/* Contact Information Section */}
    <div className="px-6 py-3 bg-gray-50 flex flex-wrap gap-4 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <FaPhone className="h-4 w-4" aria-hidden="true" />
        <span>{user.contact}</span>
      </div>
      <div className="flex items-center gap-2">
        <FaEnvelope className="h-4 w-4" aria-hidden="true" />
        <span>{user.user.email}</span>
      </div>
    </div>
  </header>
);

export default ShopHeader;
