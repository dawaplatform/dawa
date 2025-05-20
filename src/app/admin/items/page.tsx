'use client';

import { ItemAdminSerializer, useAdminItems, useUpdateItemApprovalStatus, useUpdateItemPromotedStatus } from '@/app/server/admin/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Eye, Loader2, Star, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Define types for our custom hook
type PromotionStatusMap = Record<number, boolean>;

// Custom hook for persisting promotion status in localStorage
const usePromotionStatus = (items: ItemAdminSerializer[] | undefined): [PromotionStatusMap, (itemId: number, status: boolean) => void] => {
  // Initialize state from localStorage or from items
  const [promotionStatus, setPromotionStatus] = useState<PromotionStatusMap>({});

  // Load initial state from localStorage
  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem('itemPromotionStatus');
      if (savedStatus) {
        setPromotionStatus(JSON.parse(savedStatus));
      }
    } catch (error) {
      console.error('Error loading promotion status from localStorage:', error);
    }
  }, []);

  // Update localStorage when items change
  useEffect(() => {
    if (items && items.length > 0) {
      const newStatus = { ...promotionStatus };
      let updated = false;

      items.forEach(item => {
        // Only set if not already in our state
        if (!newStatus.hasOwnProperty(item.id)) {
          newStatus[item.id] = !!item.item_promoted;
          updated = true;
        }
      });

      if (updated) {
        setPromotionStatus(newStatus);
        localStorage.setItem('itemPromotionStatus', JSON.stringify(newStatus));
      }
    }
  }, [items, promotionStatus]);

  // Function to update a specific item's promotion status
  const updateStatus = (itemId: number, status: boolean): void => {
    const newStatus = { 
      ...promotionStatus, 
      [itemId]: status 
    };
    setPromotionStatus(newStatus);
    localStorage.setItem('itemPromotionStatus', JSON.stringify(newStatus));
  };

  return [promotionStatus, updateStatus];
};

const AdminItemsPage = () => {
  const { items, isLoading, isError, mutate } = useAdminItems();
  const { updateApprovalStatus, isUpdating } = useUpdateItemApprovalStatus();
  const { updatePromotedStatus, isUpdating: isUpdatingPromotion } = useUpdateItemPromotedStatus();
  
  const [selectedItem, setSelectedItem] = useState<ItemAdminSerializer | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [promotingItems, setPromotingItems] = useState<Record<number, boolean>>({});
  
  // Use our custom hook for promotion status
  const [promotionStatus, updatePromotionStatus] = usePromotionStatus(items);
  
  const handleApproveItem = async () => {
    if (!selectedItem) return;
    
    try {
      await updateApprovalStatus({
        item_id: selectedItem.id,
        approval_status: 'Approved',
      });
      
      toast({
        title: 'Item approved',
        description: `Item "${selectedItem.item_name}" has been approved.`,
      });
      
      setIsApprovalDialogOpen(false);
      mutate(); // Refresh the items list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve item. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleRejectItem = async () => {
    if (!selectedItem || !rejectionReason.trim()) return;
    
    try {
      await updateApprovalStatus({
        item_id: selectedItem.id,
        approval_status: 'Rejected',
        rejection_reason: rejectionReason,
      });
      
      toast({
        title: 'Item rejected',
        description: `Item "${selectedItem.item_name}" has been rejected.`,
      });
      
      setIsRejectionDialogOpen(false);
      setRejectionReason('');
      mutate(); // Refresh the items list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePromotion = async (item: ItemAdminSerializer, newStatus: boolean) => {
    // Set loading state for this specific item
    setPromotingItems(prev => ({ ...prev, [item.id]: true }));
    
    try {
      // Optimistically update our local state
      updatePromotionStatus(item.id, newStatus);
      
      // Create a copy of the current items with the updated promotion status
      const updatedItems = items?.map(i => 
        i.id === item.id 
          ? { ...i, item_promoted: newStatus } 
          : i
      );
      
      // Optimistically update the UI without revalidating
      if (updatedItems) {
        mutate({ data: updatedItems, status: 200 }, false);
      }
      
      // Make the API call
      await updatePromotedStatus({
        item_id: item.id,
        promoted_status: newStatus,
      });
      
      toast({
        title: newStatus ? 'Item promoted' : 'Item unpromoted',
        description: `Item "${item.item_name}" has been ${newStatus ? 'promoted' : 'unpromoted'}.`,
      });
      
      // Update the selected item if it's the one being viewed in detail
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem({ ...selectedItem, item_promoted: newStatus });
      }
      
    } catch (error) {
      // Revert the optimistic update on error
      updatePromotionStatus(item.id, !newStatus);
      
      toast({
        title: 'Error',
        description: `Failed to ${newStatus ? 'promote' : 'unpromote'} item. Please try again.`,
        variant: 'destructive',
      });
      
      // Revalidate to get the correct data from the server
      mutate();
    } finally {
      // Clear loading state
      setPromotingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };
  
  const openApprovalDialog = (item: ItemAdminSerializer) => {
    setSelectedItem(item);
    setIsApprovalDialogOpen(true);
  };
  
  const openRejectionDialog = (item: ItemAdminSerializer) => {
    setSelectedItem(item);
    setIsRejectionDialogOpen(true);
  };
  
  const openDetailsDialog = (item: ItemAdminSerializer) => {
    setSelectedItem(item);
    setIsDetailsDialogOpen(true);
  };

  // Helper function to get the current promotion status of an item
  const getItemPromotionStatus = (item: ItemAdminSerializer | null): boolean => {
    if (!item) return false;
    return promotionStatus[item.id] !== undefined ? promotionStatus[item.id] : !!item.item_promoted;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <span className="ml-2">Loading items...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading items. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Item Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Promoted</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {item.images && item.images.length > 0 ? (
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100 relative">
                        <Image
                          src={item.images[0].image}
                          alt={item.item_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-400 text-xs">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="truncate max-w-[200px]">{item.item_name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  ${item.item_price ? Number(item.item_price).toFixed(2) : '0.00'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.approval_status === 'Approved'
                        ? 'success'
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
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <Switch 
                        checked={getItemPromotionStatus(item)}
                        onCheckedChange={(checked) => handleTogglePromotion(item, checked)}
                        disabled={promotingItems[item.id] || item.approval_status !== 'Approved'}
                      />
                    )}
                    {getItemPromotionStatus(item) && (
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  Unknown
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailsDialog(item)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                      onClick={() => openApprovalDialog(item)}
                      disabled={isUpdating || item.approval_status === 'Approved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                      onClick={() => openRejectionDialog(item)}
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
      
      {/* Approve Item Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve "{selectedItem?.item_name}"?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleApproveItem} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Approve Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Item Dialog */}
      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Item</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedItem?.item_name}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason"
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectionDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRejectItem} 
              disabled={isUpdating || !rejectionReason.trim()}
              variant="destructive"
            >
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Reject Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Item Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedItem.item_name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Price:</span>
                      <span className="font-medium">
                        ${selectedItem.item_price ? Number(selectedItem.item_price).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span>{selectedItem.item_location}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span>{selectedItem.category}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subcategory:</span>
                      <span>{selectedItem.subcategory}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <Badge
                        variant={
                          selectedItem.approval_status === 'Approved'
                            ? 'success'
                            : selectedItem.approval_status === 'Rejected'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {selectedItem.approval_status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Promoted:</span>
                      <div className="flex items-center space-x-2">
                        {promotingItems[selectedItem.id] ? (
                          <div className="h-4 w-4 mr-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : (
                          <Switch 
                            checked={getItemPromotionStatus(selectedItem)}
                            onCheckedChange={(checked) => handleTogglePromotion(selectedItem, checked)}
                            disabled={promotingItems[selectedItem.id] || selectedItem.approval_status !== 'Approved'}
                          />
                        )}
                        {getItemPromotionStatus(selectedItem) && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Negotiable:</span>
                      <span>{selectedItem.item_negotiable ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-slate-500">Created:</span>
                      <span>{new Date(selectedItem.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <div className="aspect-square rounded-md overflow-hidden bg-slate-100 relative">
                      <Image
                        src={selectedItem.images[0].image}
                        alt={selectedItem.item_name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-md bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-400">No image available</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-slate-600 whitespace-pre-line">
                  {selectedItem.item_description || 'No description provided.'}
                </p>
              </div>
              
              {selectedItem.approval_status === 'Rejected' && selectedItem.rejection_reason && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200">
                  <h4 className="font-medium text-red-700 mb-1">Rejection Reason</h4>
                  <p className="text-red-600">{selectedItem.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminItemsPage;
