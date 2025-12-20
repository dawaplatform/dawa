import CategoryPage from '@/views/pages/category/CategoryPage';
import { Metadata } from 'next';
import {
  generatePageMetadata,
  generateCategoryMetadata,
  generateKeywords,
  truncateDescription,
} from '@/@core/utils/seo';
import { getProductCategories } from '@/app/server/categories/api';
import { slugify } from '@/@core/utils/slugify';
import Script from 'next/script';
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from '@/@core/utils/seo';
import { openApiClient } from '@/@core/utils/apiClient';

interface PageProps {
  params: Promise<{
    slug?: string[] | string;
  }>;
}

async function getCategoryForMetadata(slug: string[]) {
  try {
    const categories = await getProductCategories();
    if (!categories || !Array.isArray(categories)) return null;

    const categoryName = slug[0];
    const subcategoryName = slug[1];
    const brand = slug[2];
    const model = slug[3];
    const location = slug[4];

    const category = categories.find(
      (cat: any) => slugify(cat.category_name) === slugify(categoryName),
    );

    if (!category) return null;

    const subcategory = subcategoryName
      ? category.subcategories?.find(
          (sub: any) =>
            slugify(sub.subcategory_name) === slugify(subcategoryName),
        )
      : null;

    // Fetch product count for this category/brand/model combination
    let itemCount = 0;
    try {
      const body: any = {};
      if (subcategory) {
        body.subcategory_id = subcategory.id;
      } else {
        body.category_id = category.id;
      }

      const response = await openApiClient.post('/getitems/', {
        ...body,
        page: 1,
        page_size: 1,
      });
      itemCount = response.data?.count || 0;
    } catch (error) {
      // If API fails, continue without count
    }

    return {
      category,
      subcategory,
      brand,
      model,
      location,
      itemCount,
    };
  } catch (error) {
    console.error('Error fetching category for metadata:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;

  // Decode and process the slug
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.map((s) => decodeURIComponent(s))
    : resolvedParams.slug
      ? [decodeURIComponent(resolvedParams.slug)]
      : [];

  const categoryData = await getCategoryForMetadata(slug);

  if (!categoryData) {
    return generatePageMetadata({
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.',
      path: `/cat/${slug.join('/')}`,
    });
  }

  const { category, subcategory, brand, model, location, itemCount } =
    categoryData;

  // Use programmatic SEO metadata generator
  const metadata = generateCategoryMetadata({
    category: category.category_name,
    subcategory: subcategory?.subcategory_name,
    brand: brand ? decodeURIComponent(brand.replace(/-/g, ' ')) : undefined,
    model: model ? decodeURIComponent(model.replace(/-/g, ' ')) : undefined,
    location: location ? decodeURIComponent(location.replace(/-/g, ' ')) : undefined,
    itemCount,
  });

  // Add keywords to metadata
  const keywords = generateKeywords({
    category: category.category_name,
    subcategory: subcategory?.subcategory_name,
    brand: brand ? decodeURIComponent(brand.replace(/-/g, ' ')) : undefined,
    model: model ? decodeURIComponent(model.replace(/-/g, ' ')) : undefined,
    location: location ? decodeURIComponent(location.replace(/-/g, ' ')) : undefined,
  });

  return {
    ...metadata,
    keywords: keywords,
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;

  // Decode and process the slug
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.map((s) => decodeURIComponent(s))
    : resolvedParams.slug
      ? [decodeURIComponent(resolvedParams.slug)]
      : [];

  const categoryData = await getCategoryForMetadata(slug);

  // Build breadcrumbs
  const breadcrumbs = categoryData
    ? [
        { name: 'Home', url: '/home' },
        ...(categoryData.category
          ? [
              {
                name: categoryData.category.category_name,
                url: `/cat/${slugify(categoryData.category.category_name)}`,
              },
            ]
          : []),
        ...(categoryData.subcategory
          ? [
              {
                name: categoryData.subcategory.subcategory_name,
                url: `/cat/${slugify(categoryData.category.category_name)}/${slugify(categoryData.subcategory.subcategory_name)}`,
              },
            ]
          : []),
      ]
    : undefined;

  // Generate structured data
  const collectionSchema = categoryData
    ? generateCollectionPageSchema({
        name: categoryData.subcategory
          ? categoryData.subcategory.subcategory_name
          : categoryData.category.category_name,
        description: categoryData.subcategory
          ? categoryData.subcategory.description
          : categoryData.category.description,
        url: categoryData.subcategory
          ? `/cat/${slugify(categoryData.category.category_name)}/${slugify(categoryData.subcategory.subcategory_name)}`
          : `/cat/${slugify(categoryData.category.category_name)}`,
      })
    : null;

  const breadcrumbSchema = breadcrumbs
    ? generateBreadcrumbSchema(breadcrumbs)
    : null;

  return (
    <>
      {collectionSchema && (
        <Script
          id="collection-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(collectionSchema),
          }}
        />
      )}
      {breadcrumbSchema && (
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      <CategoryPage category={slug} />
    </>
  );
}
