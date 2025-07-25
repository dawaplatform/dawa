'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductType } from '@/views/pages/product/types/product';
import { AlertCircle } from 'lucide-react';
import React from 'react';

interface DescriptionProps {
  product: ProductType;
}

const Description: React.FC<DescriptionProps> = ({ product }) => {
  if (!product.description && !product.metadata) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            No description or features available for this product.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {product.description && (
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        )}
        {product.metadata && typeof product.metadata === 'object' && Object.keys(product.metadata).length > 0 && (
          <div>
            <ul className="list-disc pl-5 space-y-2">
              {Object.entries(product.metadata).map(([key, value]) => (
                <li key={key} className="text-gray-600">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Description;
