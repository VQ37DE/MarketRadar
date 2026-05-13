import fs from 'node:fs';

const path = 'seeds/mock_listings.json';
const existing = JSON.parse(fs.readFileSync(path, 'utf8')).filter((item) => !/^seed-0(2[1-9]|[3-5][0-9]|60)$/.test(item.id));

const locations = ['Austin, TX', 'Round Rock, TX', 'Cedar Park, TX', 'Pflugerville, TX', 'Buda, TX', 'Georgetown, TX', 'San Marcos, TX', 'Kyle, TX'];
const conditions = ['good', 'fair', 'like_new'];

const categoryCode = {
  electronics: 'ela',
  'home-improvement': 'tla',
  furniture: 'fua',
  'sporting-goods': 'sga',
  'books-movies-music': 'bka',
  'home-kitchen': 'hsa',
  'musical-instruments': 'msa',
  'auto-parts': 'pta',
  womenswear: 'cla',
  'jewelry-watches': 'jwa',
  baby: 'baa',
  'toys-games': 'taa',
  'luggage-bags': 'cla',
  'patio-garden': 'gra',
};

const vehicleImages = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
];

const vehicleTitles = [
  '2007 Chevrolet Tahoe',
  '2014 Toyota Tacoma',
  '2018 Honda Civic',
  '2012 Ford F-150',
  '2016 Subaru Outback',
  '2005 Jeep Wrangler',
  '2019 Toyota 4Runner',
  '2015 Lexus RX 350',
  '2011 BMW 328i',
  '2020 Mazda CX-5',
  '2008 Toyota Prius',
  '2017 Chevrolet Silverado',
  '2013 Honda CR-V',
  '2006 Ford Mustang',
  '2021 Tesla Model 3',
  '2010 Nissan Frontier',
  '2016 Ram 1500',
  '2004 Toyota Land Cruiser',
  '2018 Volkswagen Golf GTI',
  '2012 Mercedes-Benz E350',
];

const vehiclePrices = [8400, 18500, 13900, 14950, 11200, 16800, 27900, 17400, 8900, 21900, 7200, 24750, 11950, 13200, 28900, 14500, 20900, 26500, 18900, 15500];
const vehicleScores = [86, 82, 74, 69, 77, 88, 63, 71, 58, 76, 81, 67, 73, 70, 65, 79, 61, 84, 72, 68];

function craigslistUrl(city, category, title) {
  const subdomain = city.split(',')[0].toLowerCase().replace(/[^a-z]/g, '') || 'austin';
  return `https://${subdomain}.craigslist.org/search/${category}?query=${encodeURIComponent(title)}&sort=date`;
}

function facebookUrl(title) {
  return `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(title)}`;
}

function dateFor(index, minute = '15') {
  const day = String(12 - Math.floor(index / 7)).padStart(2, '0');
  const hour = String(20 - (index % 10)).padStart(2, '0');
  return `2026-05-${day}T${hour}:${minute}:00Z`;
}

const added = [];

vehicleTitles.forEach((title, index) => {
  const platform = index % 2 ? 'facebook' : 'craigslist';
  const location = locations[index % locations.length];
  added.push({
    id: `seed-${String(21 + index).padStart(3, '0')}`,
    title,
    price: vehiclePrices[index],
    location,
    platform,
    category_id: 'vehicles',
    category_name: 'Vehicles',
    condition: conditions[index % conditions.length],
    description: 'General vehicle listing with enough detail for price comparison, filtering, and MarketRadar deal scoring.',
    images: [vehicleImages[index % vehicleImages.length]],
    url: platform === 'facebook' ? facebookUrl(title) : craigslistUrl(location, 'cta', title),
    posted_at: dateFor(index, '15'),
    scraped_at: dateFor(index, '17'),
    deal_score: vehicleScores[index],
    watchlist_id: 'vehicles',
    relist_count: index % 5 === 0 ? 2 : index % 4 === 0 ? 1 : 0,
    price_drop_amount: index % 5 === 0 ? 1200 : index % 4 === 0 ? 650 : 0,
    price_drop_percent: index % 5 === 0 ? 8.7 : index % 4 === 0 ? 4.2 : 0,
    days_sitting: index % 5 === 0 ? 22 : index % 4 === 0 ? 11 : 0,
    history: [],
  });
});

const mixedListings = [
  ['seed-041', 'Bose QuietComfort Ultra Headphones', 230, 'electronics', 'Electronics', 'facebook', 'like_new', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
  ['seed-042', 'DeWalt 20V Max Tool Combo Kit', 260, 'home-improvement', 'Home Improvement', 'craigslist', 'good', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80'],
  ['seed-043', 'West Elm Mid-Century Dresser', 420, 'furniture', 'Furniture', 'facebook', 'good', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'],
  ['seed-044', 'Peloton Bike Plus', 875, 'sporting-goods', 'Sporting Goods', 'craigslist', 'good', 'https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=900&q=80'],
  ['seed-045', 'Technics SL-1200MK2 Turntable', 650, 'books-movies-music', 'Books, Movies & Music', 'facebook', 'fair', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80'],
  ['seed-046', 'KitchenAid Artisan Stand Mixer', 185, 'home-kitchen', 'Home & Kitchen', 'craigslist', 'good', 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80'],
  ['seed-047', 'Yeti Tundra 45 Cooler', 190, 'sporting-goods', 'Sporting Goods', 'facebook', 'good', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'],
  ['seed-048', 'Martin D-15M Acoustic Guitar', 980, 'musical-instruments', 'Musical Instruments', 'craigslist', 'like_new', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80'],
  ['seed-049', 'Restoration Hardware Floor Lamp', 240, 'furniture', 'Furniture', 'facebook', 'good', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80'],
  ['seed-050', 'Sony Bravia 65 Inch OLED TV', 725, 'electronics', 'Electronics', 'craigslist', 'good', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80'],
  ['seed-051', 'Thule Motion XT Roof Box', 430, 'auto-parts', 'Auto Parts', 'facebook', 'good', 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'],
  ['seed-052', 'Burberry Wool Trench Coat', 310, 'womenswear', 'Womenswear', 'craigslist', 'good', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'],
  ['seed-053', 'Garmin Fenix 7 Sapphire Solar', 485, 'jewelry-watches', 'Jewelry & Watches', 'facebook', 'like_new', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80'],
  ['seed-054', 'Stokke Tripp Trapp High Chair', 145, 'baby', 'Baby', 'craigslist', 'good', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80'],
  ['seed-055', 'Lego Millennium Falcon 75192', 520, 'toys-games', 'Toys & Games', 'facebook', 'good', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80'],
  ['seed-056', 'Tumi Alpha 3 Carry-On', 280, 'luggage-bags', 'Luggage & Bags', 'craigslist', 'good', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'],
  ['seed-057', 'Green Egg Large Ceramic Grill', 700, 'patio-garden', 'Patio & Garden', 'facebook', 'fair', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80'],
  ['seed-058', 'Dyson V15 Detect Vacuum', 360, 'home-kitchen', 'Home & Kitchen', 'craigslist', 'like_new', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80'],
  ['seed-059', 'Arcade1Up Street Fighter Cabinet', 290, 'toys-games', 'Toys & Games', 'facebook', 'good', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'],
  ['seed-060', 'Pair of Nightstands Walnut', 175, 'furniture', 'Furniture', 'craigslist', 'good', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80'],
];

mixedListings.forEach(([id, title, price, categoryId, categoryName, platform, condition, image], index) => {
  const location = locations[(index + 3) % locations.length];
  added.push({
    id,
    title,
    price,
    location,
    platform,
    category_id: categoryId,
    category_name: categoryName,
    condition,
    description: 'Fresh marketplace listing with enough detail for scoring, filtering, and Relist Radar display.',
    images: [image],
    url: platform === 'facebook' ? facebookUrl(title) : craigslistUrl(location, categoryCode[categoryId] || 'sss', title),
    posted_at: dateFor(index, '40'),
    scraped_at: dateFor(index, '41'),
    deal_score: [78, 83, 66, 75, 89, 72, 68, 91, 57, 74, 62, 70, 85, 64, 76, 69, 73, 82, 60, 71][index],
    watchlist_id: categoryId,
    relist_count: index % 6 === 0 ? 2 : index % 5 === 0 ? 1 : 0,
    price_drop_amount: index % 6 === 0 ? 90 : index % 5 === 0 ? 45 : 0,
    price_drop_percent: index % 6 === 0 ? 12.5 : index % 5 === 0 ? 7.4 : 0,
    days_sitting: index % 6 === 0 ? 18 : index % 5 === 0 ? 9 : 0,
    history: [],
  });
});

const output = [...existing, ...added].sort((a, b) => a.id.localeCompare(b.id));
fs.writeFileSync(path, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${output.length} mock listings`);
