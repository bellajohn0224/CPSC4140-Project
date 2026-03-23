export interface Place {
  id: string;
  name: string;
  description: string;
  address: string;
  recommendation: string;
  category: string;
}

export const categories = [
  {
    id: 'events',
    name: 'Free Events',
    icon: 'Calendar',
  },
  {
    id: 'food',
    name: 'Local Food',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'arts',
    name: 'Arts & Culture',
    icon: 'Palette',
  },
  {
    id: 'outdoor',
    name: 'Outdoor Spots',
    icon: 'TreePine',
  },
];

export const places: Place[] = [
    // Free events 
{
    id: '1',
    name: 'Jazz on the Alley',
    description: 'Free weekly jazz with local & regional musicians, plus food and drinks. Thursdays, 7–9 PM.',
    address: 'Ram Cat Alley & Townville St, Downtown Seneca, SC',
    recommendation: 'A relaxed, social way to experience local culture—great for live music, casual nights out, and connecting with the community.',
    category: 'events',
},
{
    id: '2',
    name: 'Pop in the Park',
    description: 'Spring flea market with local vendors, artists, and live music. April 12, 10 AM–4 PM.',
    address: 'Gateway Park (348 Old Greenville Hwy)',
    recommendation: 'A lively, family-friendly event perfect for browsing local goods, enjoying music, and spending time outdoors.',
    category: 'events',
},
{
    id: '3',
    name: 'Clemson Farmers Market',
    description: 'Fresh produce, handmade goods, and local vendors. Saturdays, 8 AM–12 PM.',
    address: '578 Issaqueena Trail, Clemson, SC',
    recommendation: 'Ideal for a slow morning—grab fresh food, support local farmers, and enjoy a laid-back community atmosphere.',
    category: 'events',
},
// Local food 
{
    id: '4',
    name: 'Blackwater Roasters',
    description: 'Small-batch coffee shop with house-made drinks and pastries. Open Tue–Sat, 8 AM–4 PM.',
    address: '938 By Pass 123, Seneca, SC 29678',
    recommendation: 'A cozy, go-to spot for quality coffee and a relaxed atmosphere—perfect for studying, catching up, or easing into your morning with something local.',
    category: 'food',
},
{
    id: '5',
    name: 'Vangelis',
    description: 'Upscale downtown bistro with a seasonal menu, full bar, and wine list. Open Tue–Thu 5–9 PM, Fri–Sat 5–9:30 PM.',
    address: '119 Ram Cat Alley, Seneca, SC 29678',
    recommendation: 'A great pick for date night or a more elevated dinner downtown—best for when you want a slower, more polished local dining experience.',
    category: 'food',
},
{
    id: '6',
    name: 'Wilhelminas Kitchen',
    description: 'Southern comfort spot known for hearty plates and a cozy, local feel. Hours appear to be Tue–Thu 11 AM–3 PM',
    address: '124 W Whitner St, Anderson, SC 29624',
    recommendation: 'A warm, local favorite for comfort food—ideal when you want something homey, filling, and community-centered rather than overly formal.',
    category: 'food',
},
// Arts
{
    id: '7',
    name: 'Clemson Little Theatre',
    description: 'Community theater featuring plays, musicals, and youth productions year-round. Showtimes vary by production.',
    address: '214 S Mechanic St, Pendleton, SC 29670',
    recommendation: 'A fun, local way to experience live theater—great for a casual night out with engaging performances and a strong community feel.',
    category: 'arts',
},
{
    id: '8',
    name: 'Anderson Arts Center',
    description: 'Regional art gallery featuring rotating exhibits, classes, and events. Open Tue–Sat, 10 AM–5 PM.',
    address: '110 Federal St #6, Anderson, SC 29625',
    recommendation: 'Ideal for a quiet, creative outing—explore local art, attend events, and engage with the community in a low-key setting.',
    category: 'arts',
},
{
    id: '9',
    name: 'Pickens County Performing Arts Center',
    description: 'Historic venue hosting concerts, theater, and special performances. Event times vary.',
    address: '314 W Main St, Liberty, SC 29657',
    recommendation: 'A unique spot for live entertainment in a historic space—great for discovering performances that feel both local and memorable.',
    category: 'arts',
},
// Outdoor
{
    id: '10',
    name: 'South Carolina Botanical Gardens',
    description: 'Scenic gardens, nature trails, and outdoor exhibits on Clemson’s campus. Open daily, sunrise–sunset.',
    address: '150 Discovery Ln, Clemson, SC 29634',
    recommendation: 'A peaceful escape for walking, photos, or a quiet reset—perfect when you want something calm and naturally scenic close to campus.',
    category: 'outdoor',
},
{
    id: '11',
    name: 'Stumphouse Tunnel',
    description: 'Historic railroad tunnel with a short, cool walk and nearby waterfall views. Open daily, 10 AM–5 PM.',
    address: 'Stumphouse Tunnel Rd, Walhalla, SC 29691',
    recommendation: 'A quick, unique outing that blends history and nature—great for a short adventure that feels a little different from typical trails.',
    category: 'outdoor',
},
{
    id: '12',
    name: 'Todd Creek Falls',
    description: 'Quiet waterfall spot with a short trail and scenic surroundings. Open daily, sunrise–sunset.',
    address: '1330 State Rd S-39-337, Central, SC 29630',
    recommendation: 'A low-key hidden gem—ideal for a short hike and a peaceful break away from crowds in a more tucked-away natural setting.',
    category: 'outdoor',
},
];

export function getPlacesByCategory(categoryId: string): Place[] {
  return places.filter(place => place.category === categoryId);
}

export function getPlaceById(id: string): Place | undefined {
  return places.find(place => place.id === id);
}