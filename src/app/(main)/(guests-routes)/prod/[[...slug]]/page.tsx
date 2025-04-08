import ProdPage from '@views/pages/product/ProdPage';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

const Page = async ({ params }: PageProps) => {
  // Await params before accessing slug
  const resolvedParams = await params;

  // Ensure slug is always an array
  const slug = resolvedParams?.slug ?? [];

  return <ProdPage params={{ slug }} />;
};

export default Page;
