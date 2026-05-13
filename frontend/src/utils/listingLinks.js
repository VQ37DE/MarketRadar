const CRAIGSLIST_CATEGORY = {
  'antiques-collectibles': 'ata',
  'arts-crafts': 'ara',
  'auto-parts': 'pta',
  baby: 'baa',
  'books-movies-music': 'bka',
  electronics: 'ela',
  furniture: 'fua',
  'garage-sale': 'gms',
  'health-beauty': 'haa',
  'home-kitchen': 'hsa',
  'home-improvement': 'tla',
  'housing-for-sale': 'rea',
  'jewelry-watches': 'jwa',
  'kidswear-baby': 'cla',
  'luggage-bags': 'cla',
  menswear: 'cla',
  miscellaneous: 'foa',
  'musical-instruments': 'msa',
  'patio-garden': 'gra',
  'pet-supplies': 'hsa',
  rentals: 'apa',
  'sporting-goods': 'sga',
  'toys-games': 'taa',
  vehicles: 'cta',
  womenswear: 'cla',
};

function isPlaceholderUrl(url = '') {
  return !url || url.includes('example.com');
}

function isSearchUrl(url = '') {
  return url.includes('/marketplace/search/') || url.includes('.craigslist.org/search/');
}

function craigslistCity(location = '') {
  const city = location.split(',')[0].toLowerCase().replace(/[^a-z]/g, '');
  return city || 'austin';
}

export function listingAdUrl(listing) {
  if (!isPlaceholderUrl(listing.url)) return listing.url;

  const query = encodeURIComponent(listing.title || listing.category_name || 'marketplace deal');
  if (listing.platform === 'facebook') {
    return `https://www.facebook.com/marketplace/search/?query=${query}`;
  }

  const city = craigslistCity(listing.location);
  const category = CRAIGSLIST_CATEGORY[listing.category_id] || 'sss';
  return `https://${city}.craigslist.org/search/${category}?query=${query}&sort=date`;
}

export function isGeneratedAdUrl(listing) {
  return isPlaceholderUrl(listing.url) || isSearchUrl(listing.url);
}
