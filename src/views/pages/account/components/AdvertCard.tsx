import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, PauseCircle, Tag } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/@core/utils/CurrencyFormatter';
import { formatDate } from '@/@core/utils/dateFormatter';

interface AdvertCardProps {
  item: any; // Replace 'any' with a proper type definition for your item
  onEdit: () => void;
}

export const AdvertCard: React.FC<AdvertCardProps> = ({ item, onEdit }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardContent className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.images[0]?.image_url || '/placeholder.svg'}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {item.item_negotiable && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-green-500 text-white"
            >
              <Tag className="h-3 w-3 mr-1" />
              Negotiable
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
          <p className="text-xl font-bold text-primary_1">
            {formatCurrency(item.price)}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{item.location}</span>
            <span>•</span>
            <span>{formatDate(item.created_at)}</span>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1" disabled>
              <PauseCircle className="h-4 w-4 mr-2" />
              Pause
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
