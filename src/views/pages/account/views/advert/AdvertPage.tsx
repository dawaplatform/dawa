'use client';

import { useState } from 'react';
import { useProfile } from '@/contexts/profile-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PlusCircle,
  Package2,
  ShoppingCart,
  Banknote,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '@/@core/utils/CurrencyFormatter';
import { Skeleton } from '@/components/ui/skeleton';
import { EditAdvertSheet } from '@/components/shared/edit-advert-sheet';
import Link from 'next/link';
import CustomPagination from '@/components/shared/CustomPagination';
import { AdvertCard } from '../../components/AdvertCard';

export function AdvertsClient() {
  const { items, isLoading, mutate } = useProfile();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleUpdateSuccess = () => {
    mutate();
    setSelectedItem(null);
  };

  if (isLoading) {
    return <AdvertsSkeleton />;
  }

  const stats = [
    {
      title: 'Total Adverts',
      value: items?.total_items || 0,
      icon: Package2,
      description: `${items?.available_items || 0} active, ${items?.sold_items || 0} sold`,
    },
    {
      title: 'Available Items',
      value: items?.available_items || 0,
      icon: ShoppingCart,
      description: 'Currently listed for sale',
    },
    {
      title: 'Total Value',
      value: formatCurrency(
        items?.item_details?.reduce(
          (acc: number, item: any) => acc + item.price,
          0,
        ) || 0,
      ),
      icon: Banknote,
      description: 'Combined value of all items',
      isCurrency: true,
    },
  ];

  const totalItems = items?.item_details?.length || 0;
  const paginatedItems = items?.item_details?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Adverts</h1>
          <p className="text-muted-foreground">
            Manage and track your advertisement campaigns
          </p>
        </div>
        <Link href="/post-ad">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Advert
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isCurrency ? stat.value : stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Adverts</CardTitle>
          <Link href="/my-shop">
            <Button variant="link" className="text-primary">
              View All
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {totalItems > 0 ? (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedItems?.map((item: any) => (
                  <AdvertCard
                    key={item.id}
                    item={item}
                    onEdit={() => setSelectedItem(item)}
                  />
                ))}
              </div>
              <div className="mt-6">
                <CustomPagination
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>

      {selectedItem && (
        <EditAdvertSheet
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Adverts Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        You haven&apos;t created any adverts yet. Start by creating your first
        advert to showcase your items.
      </p>
      <Link href="/post-ad">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Advert
        </Button>
      </Link>
    </div>
  );
}

function AdvertsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
