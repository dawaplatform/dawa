import { counties } from '@/data/counties';
import { districts } from '@/data/districts';
import { parishes } from '@/data/parishes';
import { sub_counties } from '@/data/sub_counties';
import { villages } from '@/data/villages';

export interface LocationItem {
  id: string;
  name: string;
  type: 'district' | 'county' | 'subcounty' | 'parish' | 'village';
  parent?: string;
  district?: string;
  county?: string;
  subcounty?: string;
  parish?: string;
  fullPath?: string;
}

export interface LocationSearchResult {
  item: LocationItem;
  matchType: 'exact' | 'startsWith' | 'contains' | 'fuzzy' | 'phonetic';
  score: number;
  matchedField?: string;
  confidence: number;
}

class LocationFilter {
  private allLocations: LocationItem[] = [];
  private searchIndex: Map<string, LocationItem[]> = new Map();
  private phoneticIndex: Map<string, LocationItem[]> = new Map();
  private ngramIndex: Map<string, LocationItem[]> = new Map();
  private aliasMap: Map<string, string> = new Map();

  constructor() {
    this.buildLocationHierarchy();
    this.buildCommonAliases();
    this.buildSearchIndex();
    this.buildPhoneticIndex();
    this.buildNgramIndex();
  }

  private buildLocationHierarchy(): void {
    // Build districts first
    const districtMap = new Map<string, LocationItem>();
    if (districts && districts.length > 0) {
      districts.forEach(district => {
        // Validate district data
        if (!district || !district.id || !district.name) {
          return;
        }

        const location: LocationItem = {
          id: district.id,
          name: district.name,
          type: 'district',
          fullPath: district.name
        };
        this.allLocations.push(location);
        districtMap.set(district.id, location);
      });
    }

    // Build counties
    const countyMap = new Map<string, LocationItem>();
    if (counties && counties.length > 0) {
      counties.forEach(county => {
        // Validate county data
        if (!county || !county.id || !county.name || !county.district) {
          return;
        }

        const district = districtMap.get(county.district);
        if (district) {
          const location: LocationItem = {
            id: county.id,
            name: county.name,
            type: 'county',
            parent: county.district,
            district: district.name,
            fullPath: `${district.name}, ${county.name}`
          };
          this.allLocations.push(location);
          countyMap.set(county.id, location);
        }
      });
    }

    // Build sub-counties
    const subcountyMap = new Map<string, LocationItem>();
    if (sub_counties && sub_counties.length > 0) {
      sub_counties.forEach(subcounty => {
        // Validate subcounty data
        if (!subcounty || !subcounty.id || !subcounty.name || !subcounty.county) {
          return;
        }

        const county = countyMap.get(subcounty.county);
        if (county) {
          const location: LocationItem = {
            id: subcounty.id,
            name: subcounty.name,
            type: 'subcounty',
            parent: subcounty.county,
            county: county.name,
            district: county.district,
            fullPath: `${county.district}, ${county.name}, ${subcounty.name}`
          };
          this.allLocations.push(location);
          subcountyMap.set(subcounty.id, location);
        }
      });
    }

    // Build parishes
    const parishMap = new Map<string, LocationItem>();
    if (parishes && parishes.length > 0) {
      parishes.forEach(parish => {
        // Validate parish data
        if (!parish || !parish.id || !parish.name || !parish.subcounty) {
          return;
        }

        const subcounty = subcountyMap.get(parish.subcounty);
        if (subcounty) {
          const location: LocationItem = {
            id: parish.id,
            name: parish.name,
            type: 'parish',
            parent: parish.subcounty,
            subcounty: subcounty.name,
            county: subcounty.county,
            district: subcounty.district,
            fullPath: `${subcounty.district}, ${subcounty.county}, ${subcounty.name}, ${parish.name}`
          };
          this.allLocations.push(location);
          parishMap.set(parish.id, location);
        }
      });
    }

    // Build villages
    if (villages && villages.length > 0) {
      villages.forEach(village => {
        // Validate village data
        if (!village || !village.id || !village.name || !village.parish) {
          return;
        }

        const parish = parishMap.get(village.parish);
        if (parish) {
          const location: LocationItem = {
            id: village.id,
            name: village.name,
            type: 'village',
            parent: village.parish,
            parish: parish.name,
            subcounty: parish.subcounty,
            county: parish.county,
            district: parish.district,
            fullPath: `${parish.district}, ${parish.county}, ${parish.subcounty}, ${parish.name}, ${village.name}`
          };
          this.allLocations.push(location);
        }
      });
    }
  }

  private buildCommonAliases(): void {
    // Common misspellings and variations
    const commonAliases: Record<string, string> = {
      'kampla': 'kampala',
      'kmapala': 'kampala',
      'kampalla': 'kampala',
      'kla': 'kampala',
      'jnja': 'jinja',
      'jinjja': 'jinja',
      'mbrara': 'mbarara',
      'mbarra': 'mbarara',
      'lira': 'lira',
      'sorot': 'soroti',
      'mbaleh': 'mbale',
      'fortportal': 'fort portal',
      'fort-portal': 'fort portal',
      'ftportal': 'fort portal',
      'kaese': 'kasese',
      'hoyma': 'hoima',
      'masak': 'masaka',
      'maasaka': 'masaka',
      'arrua': 'arua',
      'kabaale': 'kabale',
      'rukungir': 'rukungiri',
      'ntugamo': 'ntungamo',
      'bushenji': 'bushenyi',
      'mubendi': 'mubende',
      // Add more common variations
      'entebe': 'entebbe',
      'wakisso': 'wakiso',
      'toro': 'tororo',
      'bussia': 'busia',
      'palisa': 'pallisa',
      'kummi': 'kumi',
      'kapchora': 'kapchorwa',
      'bugir': 'bugiri',
      'luka': 'luuka',
    };

    Object.entries(commonAliases).forEach(([alias, canonical]) => {
      this.aliasMap.set(alias.toLowerCase(), canonical.toLowerCase());
    });
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Remove diacritics
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Standardize separators
      .replace(/[\/\-_]+/g, ' ')
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      // Remove special characters but keep alphanumeric and spaces
      .replace(/[^a-z0-9\s]/g, '');
  }

  private buildSearchIndex(): void {
    this.allLocations.forEach(location => {
      const searchTerms = this.getSearchTerms(location);
      searchTerms.forEach(term => {
        if (!this.searchIndex.has(term)) {
          this.searchIndex.set(term, []);
        }
        this.searchIndex.get(term)!.push(location);
      });
    });
  }

  private getSearchTerms(location: LocationItem): string[] {
    const terms = new Set<string>();
    const normalized = this.normalizeText(location.name);
    
    // Add normalized name
    terms.add(normalized);
    
    // Add individual words
    const words = normalized.split(/\s+/).filter(w => w.length > 1);
    words.forEach(word => terms.add(word));
    
    // Add all prefixes (for autocomplete)
    words.forEach(word => {
      for (let i = 2; i <= word.length; i++) {
        terms.add(word.substring(0, i));
      }
    });

    // Add word combinations for compound names
    if (words.length > 1) {
      for (let i = 0; i < words.length - 1; i++) {
        terms.add(words.slice(i, i + 2).join(' '));
      }
    }

    // Add full path terms
    if (location.fullPath) {
      const pathNormalized = this.normalizeText(location.fullPath);
      terms.add(pathNormalized);
      
      const pathWords = pathNormalized.split(/\s+/).filter(w => w.length > 1);
      pathWords.forEach(word => terms.add(word));
    }

    return Array.from(terms);
  }

  private buildPhoneticIndex(): void {
    this.allLocations.forEach(location => {
      const phoneticKey = this.getPhoneticKey(location.name);
      if (!this.phoneticIndex.has(phoneticKey)) {
        this.phoneticIndex.set(phoneticKey, []);
      }
      this.phoneticIndex.get(phoneticKey)!.push(location);
    });
  }

  // Soundex-like phonetic algorithm for Ugandan names
  private getPhoneticKey(text: string): string {
    const normalized = this.normalizeText(text);
    
    return normalized
      .replace(/[aeiou]/g, '') // Remove vowels
      .replace(/[bp]/g, '1')
      .replace(/[fv]/g, '2')
      .replace(/[cgjkq]/g, '3')
      .replace(/[dt]/g, '4')
      .replace(/[lr]/g, '5')
      .replace(/[mn]/g, '6')
      .replace(/[sz]/g, '7')
      .replace(/[hw]/g, '8')
      .replace(/[y]/g, '9')
      .substring(0, 6);
  }

  private buildNgramIndex(): void {
    this.allLocations.forEach(location => {
      const ngrams = this.getNgrams(location.name, 2);
      ngrams.forEach(ngram => {
        if (!this.ngramIndex.has(ngram)) {
          this.ngramIndex.set(ngram, []);
        }
        this.ngramIndex.get(ngram)!.push(location);
      });
    });
  }

  private getNgrams(text: string, n: number): string[] {
    const normalized = this.normalizeText(text);
    const ngrams: string[] = [];
    
    for (let i = 0; i <= normalized.length - n; i++) {
      ngrams.push(normalized.substring(i, i + n));
    }
    
    return ngrams;
  }

  private calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private getSimilarity(str1: string, str2: string): number {
    const maxLen = Math.max(str1.length, str2.length);
    if (maxLen === 0) return 1.0;
    
    const distance = this.calculateLevenshteinDistance(str1, str2);
    return 1.0 - distance / maxLen;
  }

  public search(query: string, limit: number = 20): LocationSearchResult[] {
    if (!query || query.trim().length < 1) {
      return [];
    }

    const normalizedQuery = this.normalizeText(query);
    
    // Check aliases
    const resolvedQuery = this.aliasMap.get(normalizedQuery) || normalizedQuery;
    
    const results = new Map<string, LocationSearchResult>();
    const queryWords = resolvedQuery.split(/\s+/).filter(w => w.length > 0);

    // Multi-stage search strategy
    
    // Stage 1: Exact matches
    this.findExactMatches(resolvedQuery, results);
    
    // Stage 2: Prefix matches (starts with)
    this.findPrefixMatches(resolvedQuery, queryWords, results);
    
    // Stage 3: Substring matches (contains)
    this.findSubstringMatches(resolvedQuery, queryWords, results);
    
    // Stage 4: Fuzzy matches (typos, misspellings)
    if (results.size < limit) {
      this.findFuzzyMatches(resolvedQuery, results);
    }
    
    // Stage 5: Phonetic matches (sounds like)
    if (results.size < limit / 2) {
      this.findPhoneticMatches(query, results);
    }

    // Stage 6: N-gram similarity (partial word matches)
    if (results.size < limit / 2) {
      this.findNgramMatches(resolvedQuery, results);
    }

    // Convert to array and sort
    const sortedResults = Array.from(results.values())
      .sort((a, b) => {
        // Sort by confidence first
        if (Math.abs(a.confidence - b.confidence) > 0.1) {
          return b.confidence - a.confidence;
        }
        
        // Then by match type
        const typeOrder = { exact: 5, startsWith: 4, contains: 3, fuzzy: 2, phonetic: 1 };
        const aTypeScore = typeOrder[a.matchType];
        const bTypeScore = typeOrder[b.matchType];
        
        if (aTypeScore !== bTypeScore) {
          return bTypeScore - aTypeScore;
        }
        
        // Then by hierarchy
        const hierarchyOrder = { district: 5, county: 4, subcounty: 3, parish: 2, village: 1 };
        const aHierarchy = hierarchyOrder[a.item.type];
        const bHierarchy = hierarchyOrder[b.item.type];
        
        if (aHierarchy !== bHierarchy) {
          return bHierarchy - aHierarchy;
        }
        
        // Finally by score
        return b.score - a.score;
      });

    return this.diversifyResults(sortedResults, limit);
  }

  private findExactMatches(query: string, results: Map<string, LocationSearchResult>): void {
    this.allLocations.forEach(location => {
      const normalized = this.normalizeText(location.name);
      
      if (normalized === query) {
        results.set(location.id, {
          item: location,
          matchType: 'exact',
          score: 10000,
          matchedField: 'name',
          confidence: 1.0
        });
      }
      
      // Check full path
      if (location.fullPath) {
        const pathNormalized = this.normalizeText(location.fullPath);
        if (pathNormalized === query) {
          results.set(location.id, {
            item: location,
            matchType: 'exact',
            score: 9000,
            matchedField: 'fullPath',
            confidence: 0.95
          });
        }
      }
    });
  }

  private findPrefixMatches(query: string, queryWords: string[], results: Map<string, LocationSearchResult>): void {
    this.allLocations.forEach(location => {
      const normalized = this.normalizeText(location.name);
      const nameWords = normalized.split(/\s+/);
      
      // Whole name starts with query
      if (normalized.startsWith(query)) {
        if (!results.has(location.id)) {
          results.set(location.id, {
            item: location,
            matchType: 'startsWith',
            score: 5000 + (100 - normalized.length),
            matchedField: 'name',
            confidence: 0.9
          });
        }
      }
      
      // Any word in name starts with query
      nameWords.forEach(word => {
        if (word.startsWith(query) && query.length >= 2) {
          if (!results.has(location.id)) {
            results.set(location.id, {
              item: location,
              matchType: 'startsWith',
              score: 4000 + (query.length / word.length) * 100,
              matchedField: 'word',
              confidence: 0.85
            });
          }
        }
      });

      // Multi-word query: all words match start of location words
      if (queryWords.length > 1) {
        let allMatch = true;
        let matchScore = 0;
        
        queryWords.forEach(qWord => {
          const found = nameWords.some(nWord => nWord.startsWith(qWord));
          if (!found) allMatch = false;
          else matchScore += 100;
        });

        if (allMatch && !results.has(location.id)) {
          results.set(location.id, {
            item: location,
            matchType: 'startsWith',
            score: 4500 + matchScore,
            matchedField: 'multiword',
            confidence: 0.88
          });
        }
      }
    });
  }

  private findSubstringMatches(query: string, queryWords: string[], results: Map<string, LocationSearchResult>): void {
    this.allLocations.forEach(location => {
      const normalized = this.normalizeText(location.name);
      const nameWords = normalized.split(/\s+/);
      
      // Name contains query
      if (normalized.includes(query) && !results.has(location.id)) {
        const position = normalized.indexOf(query);
        const positionBonus = Math.max(0, 100 - position * 10);
        
        results.set(location.id, {
          item: location,
          matchType: 'contains',
          score: 3000 + positionBonus + query.length * 10,
          matchedField: 'name',
          confidence: 0.75
        });
      }

      // Word contains query
      nameWords.forEach(word => {
        if (word.includes(query) && query.length >= 3 && !results.has(location.id)) {
          results.set(location.id, {
            item: location,
            matchType: 'contains',
            score: 2500 + (query.length / word.length) * 100,
            matchedField: 'word',
            confidence: 0.70
          });
        }
      });

      // Full path contains query
      if (location.fullPath) {
        const pathNormalized = this.normalizeText(location.fullPath);
        if (pathNormalized.includes(query) && !results.has(location.id)) {
          results.set(location.id, {
            item: location,
            matchType: 'contains',
            score: 2000,
            matchedField: 'fullPath',
            confidence: 0.65
          });
        }
      }

      // All query words found in location name or path
      if (queryWords.length > 1) {
        const fullText = `${normalized} ${location.fullPath ? this.normalizeText(location.fullPath) : ''}`;
        const allWordsFound = queryWords.every(qWord => fullText.includes(qWord));
        
        if (allWordsFound && !results.has(location.id)) {
          results.set(location.id, {
            item: location,
            matchType: 'contains',
            score: 2800 + queryWords.length * 50,
            matchedField: 'multiword',
            confidence: 0.72
          });
        }
      }
    });
  }

  private findFuzzyMatches(query: string, results: Map<string, LocationSearchResult>): void {
    const maxDistance = Math.ceil(query.length * 0.3); // Allow 30% error
    
    this.allLocations.forEach(location => {
      if (results.has(location.id)) return;
      
      const normalized = this.normalizeText(location.name);
      const nameWords = normalized.split(/\s+/);
      
      // Check similarity with full name
      const similarity = this.getSimilarity(query, normalized);
      if (similarity >= 0.7) {
        results.set(location.id, {
          item: location,
          matchType: 'fuzzy',
          score: 1500 + similarity * 1000,
          matchedField: 'name',
          confidence: similarity * 0.8
        });
      }
      
      // Check similarity with each word
      nameWords.forEach(word => {
        if (word.length < 3) return;
        
        const wordSimilarity = this.getSimilarity(query, word);
        if (wordSimilarity >= 0.75 && !results.has(location.id)) {
          results.set(location.id, {
            item: location,
            matchType: 'fuzzy',
            score: 1200 + wordSimilarity * 800,
            matchedField: 'word',
            confidence: wordSimilarity * 0.75
          });
        }
      });
    });
  }

  private findPhoneticMatches(query: string, results: Map<string, LocationSearchResult>): void {
    const queryPhonetic = this.getPhoneticKey(query);
    
    this.allLocations.forEach(location => {
      if (results.has(location.id)) return;
      
      const locationPhonetic = this.getPhoneticKey(location.name);
      
      if (queryPhonetic === locationPhonetic && queryPhonetic.length >= 3) {
        results.set(location.id, {
          item: location,
          matchType: 'phonetic',
          score: 1000,
          matchedField: 'phonetic',
          confidence: 0.60
        });
      }
    });
  }

  private findNgramMatches(query: string, results: Map<string, LocationSearchResult>): void {
    const queryNgrams = this.getNgrams(query, 2);
    const ngramScores = new Map<string, number>();
    
    queryNgrams.forEach(ngram => {
      const locations = this.ngramIndex.get(ngram) || [];
      locations.forEach(location => {
        const current = ngramScores.get(location.id) || 0;
        ngramScores.set(location.id, current + 1);
      });
    });

    ngramScores.forEach((count, locationId) => {
      if (results.has(locationId)) return;
      
      const similarity = count / Math.max(queryNgrams.length, 1);
      if (similarity >= 0.5) {
        const location = this.getLocationById(locationId);
        if (location) {
          results.set(locationId, {
            item: location,
            matchType: 'fuzzy',
            score: 800 + similarity * 500,
            matchedField: 'ngram',
            confidence: similarity * 0.55
          });
        }
      }
    });
  }

  private diversifyResults(results: LocationSearchResult[], limit: number): LocationSearchResult[] {
    const diversified: LocationSearchResult[] = [];
    const typeCount = { district: 0, county: 0, subcounty: 0, parish: 0, village: 0 };
    const maxPerType = Math.ceil(limit / 5);

    // First pass: high confidence results (confidence > 0.8)
    results.forEach(result => {
      if (result.confidence > 0.8 && diversified.length < limit) {
        diversified.push(result);
        typeCount[result.item.type]++;
      }
    });

    // Second pass: balance by type
    results.forEach(result => {
      if (diversified.includes(result)) return;
      if (diversified.length >= limit) return;
      
      if (typeCount[result.item.type] < maxPerType) {
        diversified.push(result);
        typeCount[result.item.type]++;
      }
    });

    // Third pass: fill remaining slots
    results.forEach(result => {
      if (diversified.includes(result)) return;
      if (diversified.length >= limit) return;
      diversified.push(result);
    });

    return diversified.slice(0, limit);
  }

  public getLocationById(id: string): LocationItem | undefined {
    return this.allLocations.find(location => location.id === id);
  }

  public getLocationsByType(type: LocationItem['type']): LocationItem[] {
    return this.allLocations.filter(location => location.type === type);
  }

  public getTotalLocations(): number {
    return this.allLocations.length;
  }

  public getStats(): {
    districts: number;
    counties: number;
    subcounties: number;
    parishes: number;
    villages: number;
    total: number;
  } {
    return {
      districts: this.getLocationsByType('district').length,
      counties: this.getLocationsByType('county').length,
      subcounties: this.getLocationsByType('subcounty').length,
      parishes: this.getLocationsByType('parish').length,
      villages: this.getLocationsByType('village').length,
      total: this.allLocations.length
    };
  }

  public getRelatedLocations(locationId: string, type?: LocationItem['type']): LocationItem[] {
    const location = this.getLocationById(locationId);
    if (!location) return [];

    const related: LocationItem[] = [];

    switch (location.type) {
      case 'district':
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'county' && loc.district === location.name
        ));
        break;
      
      case 'county':
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'district' && loc.name === location.district
        ));
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'subcounty' && loc.county === location.name
        ));
        break;
      
      case 'subcounty':
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'county' && loc.name === location.county
        ));
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'parish' && loc.subcounty === location.name
        ));
        break;
      
      case 'parish':
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'subcounty' && loc.name === location.subcounty
        ));
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'village' && loc.parish === location.name
        ));
        break;
      
      case 'village':
        related.push(...this.allLocations.filter(loc => 
          loc.type === 'parish' && loc.name === location.parish
        ));
        break;
    }

    if (type) {
      return related.filter(loc => loc.type === type);
    }

    return related;
  }

  public getLocationHierarchy(locationId: string): LocationItem[] {
    const location = this.getLocationById(locationId);
    if (!location) return [];

    const hierarchy: LocationItem[] = [];
    hierarchy.push(location);

    let current = location;
    while (current.parent) {
      const parent = this.getLocationById(current.parent);
      if (parent) {
        hierarchy.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }

    return hierarchy;
  }
}

// Create and export singleton instance
export const locationFilter = new LocationFilter();

// Export utility functions
export const searchLocations = (query: string, limit?: number) => 
  locationFilter.search(query, limit || 20);

// Export enhanced search as an alias (for backwards compatibility)
export const searchLocationsEnhanced = (query: string, limit?: number) => 
  locationFilter.search(query, limit || 20);

export const getLocationById = (id: string) => 
  locationFilter.getLocationById(id);

export const getLocationStats = () => 
  locationFilter.getStats();

export const getRelatedLocations = (locationId: string, type?: LocationItem['type']) => 
  locationFilter.getRelatedLocations(locationId, type);

export const getLocationHierarchy = (locationId: string) => 
  locationFilter.getLocationHierarchy(locationId);