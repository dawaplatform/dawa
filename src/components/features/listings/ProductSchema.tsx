import { generateBreadcrumbSchema, generateProductSchema } from '@/@core/utils/seo';
import { ProductType } from '@/views/pages/product/types/product';
import Script from 'next/script';

interface ProductSchemaProps {
  product: ProductType;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export default function ProductSchema({ product, breadcrumbs }: ProductSchemaProps) {
  const productSchema = generateProductSchema({
    id: product.id,
    item_name: product.item_name,
    item_description: product.item_description,
    item_price: product.item_price,
    images: product.images,
    item_status: product.item_status,
    category: product.category,
    subcategory: product.subcategory,
    seller: product.seller,
    created_at: product.created_at,
    updated_at: product.updated_at,
  });

  // Use Record<string, any>[] to allow different schema types
  const schemas: Record<string, any>[] = [productSchema];

  // Add breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
    schemas.push(breadcrumbSchema);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`product-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

