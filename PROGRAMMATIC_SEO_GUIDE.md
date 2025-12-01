# Programmatic SEO Implementation Guide

This guide explains how Dawa.Ug implements programmatic SEO to compete with Jiji.ug by automatically generating SEO-optimized pages for Item + Brand + Model + Location combinations.

## Overview

Programmatic SEO allows us to create thousands of optimized pages automatically, targeting specific search queries like:
- "Toyota Corolla for sale in Uganda"
- "iPhone 13 price in Kampala"
- "2 bedroom houses for rent in Ntinda"

## URL Structure

Our URL structure follows this hierarchy:

```
/cat/[category]/[subcategory]/[brand]/[model]/[location]
```

Examples:
- `/cat/vehicles/cars` - All cars
- `/cat/vehicles/cars/toyota` - Toyota cars
- `/cat/vehicles/cars/toyota/corolla` - Toyota Corolla
- `/cat/vehicles/cars/toyota/corolla/kampala` - Toyota Corolla in Kampala
- `/cat/property/houses-for-rent/kampala/ntinda` - Houses for rent in Ntinda

## Implementation Components

### 1. SEO Keywords Database (`src/@core/configs/seoKeywords.ts`)

Contains high-value keywords organized by category:
- Vehicles (Toyota, Subaru, Mercedes models)
- Real Estate (locations, property types)
- Electronics (iPhone, Samsung models)
- Jobs & Services

### 2. Programmatic Metadata Generators (`src/@core/utils/seo.ts`)

Functions for generating SEO metadata:
- `generateCategoryMetadata()` - For category/brand/model pages
- `generateRealEstateMetadata()` - For property listings
- `generateKeywords()` - Keyword array generation

### 3. Product Metadata Extractor (`src/@core/utils/productMetadataExtractor.ts`)

Extracts brand, model, year, condition, and location from products:
- `extractBrandModel()` - From product name or metadata
- `extractLocation()` - From location field
- `extractAllMetadata()` - Complete extraction

### 4. Editorial Content Component (`src/components/features/listings/EditorialContent.tsx`)

Adds valuable content to category pages:
- Price lists (data tables)
- Safety tips
- Reviews

## Meta Tag Templates

### Category Pages

**Title Template:**
```
[Model Name] for Sale in Uganda - Best Prices | Dawa.Ug
```

**Description Template:**
```
Find the best deals on [Model Name] in Uganda. Browse [Number] listings of used and new [Model Name] cars for sale in [Location].
```

### Real Estate Pages

**Title Template:**
```
[Number] Bedroom Houses for Rent in [Location] | Dawa.Ug
```

**Description Template:**
```
Looking for a [Number] bedroom house in [Location]? We have [Number] available rental properties, furnished and unfurnished, starting from [Price].
```

## Content Hierarchy (H-Tags)

On category pages, structure headers like this:

```html
<h1>Mobile Phones for Sale in Uganda</h1>
<h2>Latest iPhone Prices in Kampala</h2>
<h2>Cheap Samsung Phones (Under 500k UGX)</h2>
<h2>Tecno and Infinix Dealers</h2>
<h3>List of individual products linked here...</h3>
```

## How to Add New Categories/Brands

1. **Update SEO Keywords Database:**
   Edit `src/@core/configs/seoKeywords.ts` and add:
   - Primary keywords
   - Brand names
   - Model names
   - Popular locations

2. **Update Metadata Extractor:**
   Edit `src/@core/utils/productMetadataExtractor.ts` to recognize:
   - New brand names
   - New location patterns

3. **Update Sitemap:**
   The sitemap automatically includes new categories, but you may want to manually add high-value brand/model combinations.

## Editorial Content Strategy

To beat Jiji, add editorial content to category pages:

1. **Price Lists:**
   - Create data tables showing price ranges
   - Update annually or quarterly
   - Use structured data for tables

2. **Safety Tips:**
   - "How to buy [item] safely in Uganda"
   - Build trust with users
   - Improve time on page

3. **Reviews:**
   - Short reviews of popular models
   - Help users make decisions
   - Increase engagement

## Next Steps

1. **Export Location Data:**
   - Export all districts, counties, parishes, and villages
   - Create location-based pages for high-traffic areas

2. **Generate Brand/Model Pages:**
   - Create pages for top 50 car models
   - Create pages for top 20 phone models
   - Use the EditorialContent component

3. **Submit to Google Search Console:**
   - Submit updated sitemap
   - Request indexing for new pages
   - Monitor performance

## Monitoring

Track these metrics in Google Search Console:
- Impressions for brand/model keywords
- Click-through rates
- Average position
- Coverage report for new pages

## Best Practices

1. **Don't create empty pages** - Only generate pages with actual listings
2. **Update content regularly** - Price lists and reviews should be current
3. **Monitor performance** - Remove or improve pages with low engagement
4. **Use structured data** - Helps Google understand your content
5. **Internal linking** - Link between related brand/model pages

