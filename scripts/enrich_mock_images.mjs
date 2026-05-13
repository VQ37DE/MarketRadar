import fs from 'node:fs';
import https from 'node:https';

const path = 'seeds/mock_listings.json';

const vehiclePageTitles = {
  '2007 Chevrolet Tahoe': 'Chevrolet Tahoe',
  '2014 Toyota Tacoma': 'Toyota Tacoma',
  '2018 Honda Civic': 'Honda Civic (tenth generation)',
  '2012 Ford F-150': 'Ford F-Series (twelfth generation)',
  '2016 Subaru Outback': 'Subaru Outback',
  '2005 Jeep Wrangler': 'Jeep Wrangler (TJ)',
  '2019 Toyota 4Runner': 'Toyota 4Runner',
  '2015 Lexus RX 350': 'Lexus RX',
  '2011 BMW 328i': 'BMW 3 Series (E90)',
  '2020 Mazda CX-5': 'Mazda CX-5',
  '2008 Toyota Prius': 'Toyota Prius (XW20)',
  '2017 Chevrolet Silverado': 'Chevrolet Silverado',
  '2013 Honda CR-V': 'Honda CR-V',
  '2006 Ford Mustang': 'Ford Mustang (fifth generation)',
  '2021 Tesla Model 3': 'Tesla Model 3',
  '2010 Nissan Frontier': 'Nissan Frontier',
  '2016 Ram 1500': 'Ram pickup',
  '2004 Toyota Land Cruiser': 'Toyota Land Cruiser (J100)',
  '2018 Volkswagen Golf GTI': 'Volkswagen Golf Mk7',
  '2012 Mercedes-Benz E350': 'Mercedes-Benz E-Class (W212)',
};

const itemImageOverrides = {
  '2007 Chevrolet Tahoe': 'https://commons.wikimedia.org/wiki/Special:FilePath/2007-Chevrolet-Tahoe.jpg',
  '2010 Nissan Frontier': 'https://commons.wikimedia.org/wiki/Special:FilePath/2011%20Nissan%20Frontier%20--%2012-31-2010.jpg',
  '2004 Toyota Land Cruiser': 'https://commons.wikimedia.org/wiki/Special:FilePath/Toyota%20Land%20Cruiser%20J100%204.2TD%20VX%202006%20%281%29.jpg',
  'Bose QuietComfort Ultra Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'DeWalt 20V Max Tool Combo Kit': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=80',
  'West Elm Mid-Century Dresser': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'Peloton Bike Plus': 'https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=900&q=80',
  'Technics SL-1200MK2 Turntable': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=900&q=80',
  'KitchenAid Artisan Stand Mixer': 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=900&q=80',
  'Yeti Tundra 45 Cooler': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=900&q=80',
  'Martin D-15M Acoustic Guitar': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
  'Restoration Hardware Floor Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'Sony Bravia 65 Inch OLED TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=80',
  'Thule Motion XT Roof Box': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
  'Burberry Wool Trench Coat': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'Garmin Fenix 7 Sapphire Solar': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  'Stokke Tripp Trapp High Chair': 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80',
  'Lego Millennium Falcon 75192': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
  'Tumi Alpha 3 Carry-On': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  'Green Egg Large Ceramic Grill': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80',
  'Dyson V15 Detect Vacuum': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80',
  'Arcade1Up Street Fighter Cabinet': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
  'Pair of Nightstands Walnut': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
};

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'MarketRadar seed image helper' } }, (response) => {
        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}: ${url}`));
            return;
          }
          resolve(JSON.parse(body));
        });
      })
      .on('error', reject);
  });
}

async function wikipediaImage(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const summary = await getJson(url);
  return summary?.originalimage?.source || summary?.thumbnail?.source;
}

const imageCache = {};

for (const [listingTitle, pageTitle] of Object.entries(vehiclePageTitles)) {
  try {
    imageCache[listingTitle] = await wikipediaImage(pageTitle);
  } catch (error) {
    console.warn(`Could not fetch image for ${listingTitle}: ${error.message}`);
  }
}

const listings = JSON.parse(fs.readFileSync(path, 'utf8'));

for (const listing of listings) {
  const image = itemImageOverrides[listing.title] || imageCache[listing.title];
  if (image) listing.images = [image];
}

fs.writeFileSync(path, `${JSON.stringify(listings, null, 2)}\n`);
console.log(`Updated images for ${Object.keys(imageCache).length + Object.keys(itemImageOverrides).length} listing patterns`);
