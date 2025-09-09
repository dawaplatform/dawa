'use client';

import * as React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Location {
  name: string;
  count: number;
}

interface LocationDialogProps {
  locations: Location[];
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
}

export function LocationDialog({
  locations,
  selectedLocation,
  onLocationSelect,
}: LocationDialogProps) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // Group locations by first letter
  const groupedLocations = React.useMemo(() => {
    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(search.toLowerCase()),
    );

    return filtered.reduce(
      (groups, location) => {
        const firstLetter = location.name[0].toUpperCase();
        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }
        groups[firstLetter].push(location);
        return groups;
      },
      {} as Record<string, Location[]>,
    );
  }, [locations, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 justify-between bg-white hover:bg-gray-50 border-gray-200 text-left font-normal"
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {selectedLocation || 'All Uganda'}
            </span>
          </div>
          <Search className="h-4 w-4 text-gray-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold">
            Select Location
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Find state, city or district..."
              className="pl-10 py-6 text-lg bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-primary_1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[500px] pr-6">
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              {Object.entries(groupedLocations).map(([letter, locations]) => (
                <div key={letter} className="space-y-2">
                  <div className="text-sm font-medium text-gray-500 mb-2">
                    {letter}
                  </div>
                  {locations.map((location) => (
                    <Button
                      key={location.name}
                      variant="ghost"
                      onClick={() => {
                        onLocationSelect(location.name);
                        setOpen(false);
                      }}
                      className={cn(
                        'w-full justify-between h-12 px-3 text-base font-normal rounded-lg',
                        selectedLocation === location.name
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      )}
                    >
                      <span>{location.name}</span>
                      {/* <span className="text-gray-400 text-sm">
                        {location.count} ads
                      </span> */}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
