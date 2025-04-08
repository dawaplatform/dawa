import CategoryPage from '@/views/pages/category/CategoryPage';

interface PageProps {
  params: Promise<{
    slug?: string[] | string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await the params object
  const resolvedParams = await params;

  // Decode and process the slug
  const slug = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug.map((s) => decodeURIComponent(s))
    : resolvedParams.slug
      ? [decodeURIComponent(resolvedParams.slug)]
      : [];

  return <CategoryPage category={slug} />;
}
