import {
  BarChart3,
  Folder,
  LayoutDashboard,
  ShoppingBag,
  Users,
  type LucideIcon,
} from 'lucide-react';

interface AdminNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const adminNavLinks: AdminNavLink[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/items', label: 'Items', icon: ShoppingBag },
  { href: '/admin/categories', label: 'Categories', icon: Folder },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

export const isAdminLinkActive = (
  pathname: string | null,
  href: string,
  exact = false,
) => (exact ? pathname === href : pathname === href || !!pathname?.startsWith(`${href}/`));
