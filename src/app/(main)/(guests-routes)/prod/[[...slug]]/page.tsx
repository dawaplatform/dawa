import { decrypt } from '@/@core/utils/crypto';
import { generatePageMetadata, truncateDescription } from '@/@core/utils/seo';
import { getProductDetails } from '@/app/server/products/api';
import ProductSchema from '@/components/features/listings/ProductSchema';
import { ProductType } from '@/views/pages/product/types/product';
import ProdPage from '@views/pages/product/ProdPage';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProductForMetadata(
  slug: string[],
  searchParams: { [key: string]: string | string[] | undefined },
): Promise<ProductType | null> {
  try {
    let productId: string | null = null;

    // Try to get product ID from encrypted query param
    const encryptedId = searchParams.p as string;
    if (encryptedId) {
      productId = decrypt(encryptedId);
    }

    // If no encrypted ID, try to get from slug
    if (!productId && slug.length > 0) {
      // Try to decrypt the slug or use it directly
      const slugValue = slug[0];
      try {
        productId = decrypt(slugValue);
      } catch {
        // If decryption fails, use slug as-is (might be plain ID)
        productId = slugValue;
      }
    }

    if (!productId) {
      return null;
    }

    const response = await getProductDetails({ item_id: productId });
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug ?? [];

  const product = await getProductForMetadata(slug, resolvedSearchParams);

  if (!product) {
    return generatePageMetadata({
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
      path: `/prod/${slug.join('/')}`,
    });
  }

  const title = `${product.item_name} | Dawa.Ug`;
  const description = truncateDescription(
    product.item_description || product.item_name,
    160,
  );
  const image =
    product.images && product.images.length > 0
      ? product.images[0].image_url || ''
      : undefined;

  return generatePageMetadata({
    title,
    description,
    path: `/prod/${product.id}`,
    image,
  });
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug ?? [];

  // Fetch product for structured data
  const product = await getProductForMetadata(slug, resolvedSearchParams);

  // Build breadcrumbs
  const breadcrumbs =
    product && product.category
      ? [
          { name: 'Home', url: '/home' },
          ...(product.category
            ? [{ name: product.category, url: `/cat/${product.category}` }]
            : []),
          ...(product.subcategory
            ? [
                {
                  name: product.subcategory,
                  url: `/cat/${product.category}/${product.subcategory}`,
                },
              ]
            : []),
          { name: product.item_name, url: `/prod/${product.id}` },
        ]
      : undefined;

  return (
    <>
      {product && (
        <ProductSchema product={product} breadcrumbs={breadcrumbs} />
      )}
      <ProdPage params={{ slug }} />
    </>
  );
}
