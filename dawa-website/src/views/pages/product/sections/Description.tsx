'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductType } from '@/views/pages/product/types/product';
import { AlertCircle } from 'lucide-react';

interface DescriptionProps {
  product: ProductType;
}

const Description: React.FC<DescriptionProps> = ({ product }) => {
  if (
    !product.description
    // (!product.features || product.features.length === 0)
  ) {
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
      <CardContent className="space-y-6">
        {product.description && (
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        )}
        {/* {product.features && product.features.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-600">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default Description;
