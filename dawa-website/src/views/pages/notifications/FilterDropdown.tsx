import { FilterType } from '@/@core/types/notifications';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterDropdownProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export default function FilterDropdown({
  filter,
  setFilter,
}: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter: {filter}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setFilter('all')}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('unread')}>
          Unread
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('message')}>
          Messages
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('classified')}>
          Classified
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilter('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
