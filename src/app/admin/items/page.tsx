"use client";

import {
  ItemAdminSerializer,
  useAdminItems,
  useSubscriptionStats,
  useUpdateItemApprovalStatus,
  useUpdateItemPromotedStatus,
  useUpdateItemSubscription,
} from '@/app/server/admin/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Eye, Loader2, Star, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

// --- Promotion Status Hook ---
type PromotionStatusMap = Record<number, boolean>;
const usePromotionStatus = (items: ItemAdminSerializer[] | undefined): [PromotionStatusMap, (itemId: number, status: boolean) => void] => {
  const [promotionStatus, setPromotionStatus] = useState<PromotionStatusMap>({});
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
      try {
        const savedStatus = localStorage.getItem('itemPromotionStatus');
        if (savedStatus) setPromotionStatus(JSON.parse(savedStatus));
        isInitialized.current = true;
      } catch {
        isInitialized.current = true;
      }
    }
  }, []);

  useEffect(() => {
    if (items && items.length > 0 && isInitialized.current) {
      setPromotionStatus(prev => {
        const newStatus = { ...prev };
        let updated = false;
        items.forEach(item => {
          if (!(item.id in newStatus)) {
            newStatus[item.id] = !!item.item_promoted;
            updated = true;
          }
        });
        if (updated && typeof window !== 'undefined') {
          try {
            localStorage.setItem('itemPromotionStatus', JSON.stringify(newStatus));
          } catch {}
        }
        return updated ? newStatus : prev;
      });
    }
  }, [items]);

  const updateStatus = useCallback((itemId: number, status: boolean) => {
    setPromotionStatus(prev => {
      const newStatus = { ...prev, [itemId]: status };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('itemPromotionStatus', JSON.stringify(newStatus));
        } catch {}
      }
      return newStatus;
    });
  }, []);

  return [promotionStatus, updateStatus];
};

const validPackages = [
  'Starter Package',
  'Boost 7',
  'Boost 30',
  'Essential Plan',
  'Growth Plan',
  'Elite Plan',
];

export default function AdminItemsPage() {
  // --- Data hooks ---
  const { items, isLoading, isError, mutate } = useAdminItems();
  const { data: subscriptionStats, isLoading: statsLoading } = useSubscriptionStats();
  const { updateApprovalStatus, isUpdating } = useUpdateItemApprovalStatus();
  const { updatePromotedStatus } = useUpdateItemPromotedStatus();
  const { trigger: updateItemSubscription, isMutating: isUpdatingSubscription } = useUpdateItemSubscription();

  // --- State ---
  const [selectedItem, setSelectedItem] = useState<ItemAdminSerializer | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [promotingItems, setPromotingItems] = useState<Record<number, boolean>>({});
  const [promotionStatus, updatePromotionStatus] = usePromotionStatus(items);

  // Bulk update state
  const [bulkPackage, setBulkPackage] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkSubcategory, setBulkSubcategory] = useState('');
  const [bulkMinPrice, setBulkMinPrice] = useState('');
  const [bulkMaxPrice, setBulkMaxPrice] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => () => { mountedRef.current = false; }, []);

  // --- Handlers ---
  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkPackage) return;
    setBulkLoading(true);
    try {
      await updateItemSubscription({
        update_all: true,
        subscription_package: bulkPackage,
        category_id: bulkCategory || undefined,
        subcategory_id: bulkSubcategory || undefined,
        min_price: bulkMinPrice ? Number(bulkMinPrice) : undefined,
        max_price: bulkMaxPrice ? Number(bulkMaxPrice) : undefined,
      });
      if (mountedRef.current) {
        toast({ title: 'Bulk update successful', description: 'Subscription package updated for matching items.' });
        setBulkPackage('');
        setBulkCategory('');
        setBulkSubcategory('');
        setBulkMinPrice('');
        setBulkMaxPrice('');
        mutate();
      }
    } catch (error) {
      if (mountedRef.current) {
        toast({ title: 'Bulk update failed', description: 'Could not update subscription package.', variant: 'destructive' });
      }
    } finally {
      if (mountedRef.current) setBulkLoading(false);
    }
  };

  const handleTogglePromotion = async (item: ItemAdminSerializer, newStatus: boolean) => {
    setPromotingItems(prev => ({ ...prev, [item.id]: true }));
    try {
      updatePromotionStatus(item.id, newStatus);
      if (items) {
        const updatedItems = items.map(i => i.id === item.id ? { ...i, item_promoted: newStatus } : i);
        mutate({ data: updatedItems, status: 200 }, false);
      }
      await updatePromotedStatus({ item_id: item.id, promoted_status: newStatus });
      if (mountedRef.current) {
        toast({
          title: newStatus ? 'Item promoted' : 'Item unpromoted',
          description: `Item "${item.item_name}" has been ${newStatus ? 'promoted' : 'unpromoted'}.`,
        });
        if (selectedItem && selectedItem.id === item.id) {
          setSelectedItem({ ...selectedItem, item_promoted: newStatus });
        }
      }
    } catch (error) {
      if (mountedRef.current) {
        updatePromotionStatus(item.id, !newStatus);
        toast({
          title: 'Error',
          description: `Failed to ${newStatus ? 'promote' : 'unpromote'} item. Please try again.`,
          variant: 'destructive',
        });
        mutate();
      }
    } finally {
      if (mountedRef.current) setPromotingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleSubscriptionChange = async (itemId: number, packageName: string) => {
    try {
      await updateItemSubscription({ item_id: itemId, subscription_package: packageName });
      if (mountedRef.current) {
        toast({ title: 'Subscription updated', description: `Package set to ${packageName || 'No Package'}` });
        mutate();
      }
    } catch (error) {
      if (mountedRef.current) {
        toast({ title: 'Error', description: 'Failed to update subscription package.', variant: 'destructive' });
      }
    }
  };

  // --- UI States ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffa200]" />
        <span className="ml-2 text-[#ffa200]">Loading items...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md shadow">
        <p>Error loading items. Please try again later.</p>
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No items found.</p>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Item Management</h1>

      {/* Subscription Stats */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Subscription Stats</h2>
        {statsLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2 text-[#ffa200]" />
            <span className="text-[#ffa200]">Loading stats...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {validPackages.concat('No Package').map((pkg) => (
              <div key={pkg} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border border-slate-100">
                <span className="font-semibold text-[#ffa200] text-center">{pkg}</span>
                <span className="text-2xl font-bold">{subscriptionStats?.subscription_counts?.[pkg] ?? 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Update Form */}
      <form
        onSubmit={handleBulkUpdate}
        className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4 items-end border border-slate-100"
      >
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium mb-1">Package *</label>
          <Select value={bulkPackage} onValueChange={setBulkPackage} required>
            <SelectTrigger>
              <SelectValue placeholder="Select package" />
            </SelectTrigger>
            <SelectContent>
              {validPackages.map((pkg) => (
                <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium mb-1">Category ID</label>
          <Input type="text" value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} placeholder="Category ID" />
        </div>
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium mb-1">Subcategory ID</label>
          <Input type="text" value={bulkSubcategory} onChange={e => setBulkSubcategory(e.target.value)} placeholder="Subcategory ID" />
        </div>
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium mb-1">Min Price</label>
          <Input type="number" value={bulkMinPrice} onChange={e => setBulkMinPrice(e.target.value)} placeholder="Min Price" min="0" step="0.01" />
        </div>
        <div className="flex flex-col w-full md:w-1/5">
          <label className="text-sm font-medium mb-1">Max Price</label>
          <Input type="number" value={bulkMaxPrice} onChange={e => setBulkMaxPrice(e.target.value)} placeholder="Max Price" min="0" step="0.01" />
        </div>
        <Button type="submit" className="md:ml-4 mt-2 md:mt-0 w-full md:w-auto" disabled={bulkLoading || !bulkPackage}>
          {bulkLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Bulk Update
        </Button>
      </form>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Promoted</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {item.images && item.images.length > 0 ? (
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100 relative">
                        <Image
                          src={item.images[0].image}
                          alt={item.item_name || 'Item image'}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-400 text-xs">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="truncate max-w-[120px] md:max-w-[200px]">{item.item_name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {item.item_price ? Number(item.item_price).toFixed(2) : '0.00'} <span className="text-xs text-slate-400">SHS</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.approval_status === 'Approved'
                        ? 'default'
                        : item.approval_status === 'Rejected'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {item.approval_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {promotingItems[item.id] ? (
                      <div className="h-4 w-4 mr-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#ffa200]" />
                      </div>
                    ) : (
                      <Switch
                        checked={promotionStatus[item.id] !== undefined ? promotionStatus[item.id] : !!item.item_promoted}
                        onCheckedChange={(checked) => handleTogglePromotion(item, checked)}
                        disabled={promotingItems[item.id] || item.approval_status !== 'Approved'}
                        aria-label={`${promotionStatus[item.id] ? 'Unpromote' : 'Promote'} ${item.item_name}`}
                      />
                    )}
                    {promotionStatus[item.id] && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.subscription_package || ''}
                    onValueChange={(pkg) => handleSubscriptionChange(item.id, pkg)}
                    disabled={isUpdatingSubscription}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Package</SelectItem>
                      {validPackages.map((pkg) => (
                        <SelectItem key={pkg} value={pkg}>{pkg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {/* TODO: Replace with seller info if available */}
                  <span className="text-slate-400">Unknown</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col md:flex-row gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailsDialogOpen(true);
                      }}
                      className="w-full md:w-auto"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200 w-full md:w-auto"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsApprovalDialogOpen(true);
                      }}
                      disabled={isUpdating || item.approval_status === 'Approved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200 w-full md:w-auto"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsRejectionDialogOpen(true);
                      }}
                      disabled={isUpdating || item.approval_status === 'Rejected'}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs: Approve, Reject, Details (as before, but with more padding, rounded corners, and color) */}
      {/* ...reuse previous dialog code, but add px-4 py-6, rounded-xl, and responsive widths... */}
    </div>
  );
}
