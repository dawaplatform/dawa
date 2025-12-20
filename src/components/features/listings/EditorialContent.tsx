/**
 * Editorial Content Component for Programmatic SEO
 * Adds price lists, reviews, and safety tips to category pages
 * This helps beat Jiji by providing valuable editorial content
 */

interface PriceRange {
  model?: string;
  min: number;
  max: number;
  year?: string;
}

interface EditorialContentProps {
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  priceRanges?: PriceRange[];
  safetyTips?: string[];
  review?: {
    title: string;
    content: string;
  };
}

export default function EditorialContent({
  category,
  subcategory,
  brand,
  model,
  priceRanges,
  safetyTips,
  review,
}: EditorialContentProps) {
  const displayName = model && brand
    ? `${brand} ${model}`
    : brand
      ? `${brand} ${subcategory || category}`
      : subcategory || category;

  return (
    <div className="mt-12 space-y-8">
      {/* Price List Table */}
      {priceRanges && priceRanges.length > 0 && (
        <section className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {displayName} Prices in Uganda (2024)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary_1 text-white">
                  <th className="border p-3 text-left">Model/Type</th>
                  <th className="border p-3 text-left">Price Range</th>
                  {priceRanges[0]?.year && (
                    <th className="border p-3 text-left">Year</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {priceRanges.map((range, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border p-3 font-medium">
                      {range.model || displayName}
                    </td>
                    <td className="border p-3">
                      {formatPrice(range.min)} - {formatPrice(range.max)} UGX
                    </td>
                    {range.year && (
                      <td className="border p-3">{range.year}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            *Prices are estimates based on current market trends. Actual prices may vary.
          </p>
        </section>
      )}

      {/* Safety Tips */}
      {safetyTips && safetyTips.length > 0 && (
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            How to Buy {displayName} Safely in Uganda
          </h2>
          <ul className="space-y-3">
            {safetyTips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary_1 font-bold mr-2">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Review Section */}
      {review && (
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K`;
  }
  return price.toString();
}


