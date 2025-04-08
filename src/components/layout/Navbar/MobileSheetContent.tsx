'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@core/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  // Users,
  // MessageSquare,
  HelpCircle,
  FileText,
  LogOut,
  Heart,
  // Bell,
  Mail,
  // BarChart2,
} from 'lucide-react';
import Logo from '@public/assets/svgs/DAWA_VARIATION_04.svg';
// import { categories } from '@/lib/mock_data';

// Import the DialogTitle and VisuallyHidden components from Radix UI
import { DialogTitle } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MobileSheetContentProps {
  onClose: () => void;
}

const menuItems = [
  { href: '/account/adverts', icon: FileText, label: 'My Adverts' },
  // { href: '/account/followers', icon: Users, label: 'Followers' },
  // { href: '/account/feedback', icon: MessageSquare, label: 'Feedback' },
  // { href: '/account/performance', icon: BarChart2, label: 'Performance' },
  { href: '/account/settings', icon: Settings, label: 'Settings' },
  { href: '/faqs', icon: HelpCircle, label: 'FAQ' },
];

const MobileSheetContent: React.FC<MobileSheetContentProps> = ({ onClose }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleNavigation = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <ScrollArea className="h-full">
      {/* 
        Adding a visually hidden DialogTitle to satisfy accessibility requirements.
        Screen readers will now be able to announce this dialog as "Mobile Menu".
      */}
      <DialogTitle>
        <VisuallyHidden>Mobile Menu</VisuallyHidden>
      </DialogTitle>

      <div className="flex flex-col gap-6 p-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center justify-center"
        >
          <Logo className="w-auto h-16" />
        </Link>

        {user && (
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}

        {/* <Separator /> */}

        {/* Categories Accordion */}
        {/* <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="text-lg font-semibold">Browse Categories</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2 pt-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.href}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-4 text-sm hover:bg-gray-100"
                      onClick={() => handleNavigation(category.href)}
                    >
                      <Icon className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}

        <Separator />

        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start py-3 px-4"
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        {user && (
          <>
            <Separator />
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4"
                onClick={() => handleNavigation('/wishlist')}
              >
                <Heart className="mr-3 h-4 w-4" />
                Favorites
              </Button>
              {/* <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4"
                onClick={() => handleNavigation('/notifications')}
              >
                <Bell className="mr-3 h-4 w-4" />
                Notifications
              </Button> */}
              <Button
                variant="ghost"
                className="w-full justify-start py-3 px-4"
                onClick={() => handleNavigation('/messages')}
              >
                <Mail className="mr-3 h-4 w-4" />
                Messages
              </Button>
            </div>

            <Separator />

            <Button
              variant="ghost"
              className="w-full justify-start py-3 px-4 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Log out
            </Button>
          </>
        )}

        {!user && (
          <>
            <Separator />
            <div className="space-y-2">
              <Button
                className="w-full bg-gray-700"
                onClick={() => handleNavigation('/login')}
              >
                Log In
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleNavigation('/signup')}
              >
                Sign Up
              </Button>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default React.memo(MobileSheetContent);
