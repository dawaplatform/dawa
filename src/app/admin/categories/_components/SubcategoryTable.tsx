'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { SubcategoryTableProps } from './types';

export const SubcategoryTable = ({
  subcategories,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: SubcategoryTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subcategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                No subcategories found. Add your first subcategory to get started.
              </TableCell>
            </TableRow>
          ) : (
            subcategories.map((subcategory) => (
              <TableRow key={subcategory.id}>
                <TableCell className="font-medium">{subcategory.subcategory_name}</TableCell>
                <TableCell>
                  {subcategory.image_url && (
                    <img src={subcategory.image_url} alt="" className="w-10 h-10 object-contain rounded" />
                  )}
                </TableCell>
                <TableCell>
                  <Badge>{subcategory.category.category_name}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{subcategory.item_count || 0}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(subcategory.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(subcategory)}
                      disabled={isUpdating}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(subcategory)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};