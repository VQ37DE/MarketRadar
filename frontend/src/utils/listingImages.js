const CATEGORY_IMAGE_URL = {
  'antiques-collectibles': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  'arts-crafts': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  'auto-parts': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80',
  baby: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80',
  'books-movies-music': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80',
  electronics: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
  'garage-sale': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
  'health-beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
  'home-improvement': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80',
  'housing-for-sale': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'jewelry-watches': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  'kidswear-baby': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80',
  'luggage-bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  menswear: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  miscellaneous: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'musical-instruments': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
  'patio-garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
  'pet-supplies': 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=900&q=80',
  rentals: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'sporting-goods': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
  'toys-games': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=900&q=80',
  vehicles: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  womenswear: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
};

function fallbackImageForListing(listing) {
  const title = (listing.title || '').toLowerCase();
  if (title.includes('monitor')) return CATEGORY_IMAGE_URL.electronics;
  if (title.includes('bike') || title.includes('diverge') || title.includes('topstone') || title.includes('checkpoint')) return CATEGORY_IMAGE_URL['sporting-goods'];
  if (title.includes('camera') || title.includes('canon') || title.includes('fujifilm') || title.includes('sony')) return CATEGORY_IMAGE_URL['antiques-collectibles'];
  if (title.includes('macbook') || title.includes('laptop')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80';
  if (title.includes('chair')) return 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80';
  if (title.includes('sofa')) return CATEGORY_IMAGE_URL.furniture;
  if (title.includes('desk')) return 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80';
  if (title.includes('nintendo') || title.includes('steam deck') || title.includes('playstation')) return CATEGORY_IMAGE_URL['toys-games'];
  if (title.includes('guitar') || title.includes('speaker') || title.includes('yamaha')) return CATEGORY_IMAGE_URL['musical-instruments'];
  return CATEGORY_IMAGE_URL[listing.category_id] || CATEGORY_IMAGE_URL.miscellaneous;
}

export function listingImageUrl(listing) {
  const platformImage = listing.images?.find((image) => typeof image === 'string' && image.trim());
  return platformImage || fallbackImageForListing(listing);
}

export function fallbackListingImageUrl(listing) {
  return fallbackImageForListing(listing);
}
