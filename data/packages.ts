export interface SafariPackage {
  id: string;
  title: string;
  park: 'yala' | 'udawalawe' | 'wilpattu' | 'minneriya';
  parkName: string;
  tagline: string;
  duration: string;
  timeSlot: 'Dawn Patrol (5:30 AM)' | 'Dusk Safari (2:30 PM)' | 'Full-Day VIP (5:30 AM - 6:00 PM)';
  priceUsd: number;
  priceEur: number;
  priceLkr: number;
  rating: number;
  reviewsCount: number;
  sightingsRate: string;
  badge?: string;
  image: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  maxGuests: number;
}

export interface JeepVehicle {
  id: string;
  name: string;
  tagline: string;
  model: string;
  image: string;
  capacity: string;
  features: string[];
  specs: {
    suspension: string;
    seating: string;
    viewingAngle: string;
    charging: string;
    amenities: string;
  };
}

export interface ParkDestination {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  image: string;
  primarySpecies: string[];
  bestSeason: string;
  keyFact: string;
  distanceFromColombo: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  comment: string;
  sightingPhoto?: string;
  sightingTag?: string;
  packageBooked: string;
  avatar: string;
}

export const SAFARI_PACKAGES: SafariPackage[] = [
  {
    id: 'sunset-safari-signature',
    title: 'Sunset Safari: Golden Hour Savanna Expedition',
    park: 'yala',
    parkName: 'Yala & Udawalawe Sunset Corridors',
    tagline: 'Panoramic Viewpoint 4x4 Jeep Expedition at Dusk',
    duration: '2 Nights (3 Days)',
    timeSlot: 'Dusk Safari (2:30 PM)',
    priceUsd: 1250,
    priceEur: 1150,
    priceLkr: 375000,
    rating: 4.99,
    reviewsCount: 520,
    sightingsRate: '100% Sunset Savanna Sightings',
    badge: 'Signature Sunset',
    image: '/images/sunset-safari-tour.jpg',
    description: 'Experience breathtaking sunset wildlife encounters from elevated savanna viewpoints in our custom 4x4 overland Land Cruisers.',
    highlights: [
      'Elevated cliff viewpoint golden hour safari',
      'Exclusive 2-4 guest capacity for private comfort',
      'Certified master naturalist guide & tracker',
      'Luxury wilderness camp setup with sunset champagne'
    ],
    inclusions: [
      'Private Custom 4x4 Overland Land Cruiser',
      'Certified Senior Naturalist Guide & Tracker',
      'Chilled Beverages & Sundowner Refreshments',
      'All National Park VIP Permits & Entry',
      'High-Zoom Binoculars & Wildlife Spotting Equipment'
    ],
    maxGuests: 4
  },
  {
    id: 'yala-leopard-vip',
    title: 'Yala Block 1 Exclusive Leopard & Bear Expedition',
    park: 'yala',
    parkName: 'Yala National Park',
    tagline: 'World’s Highest Leopard Density Safari Experience',
    duration: '4 Hours 30 Mins',
    timeSlot: 'Dawn Patrol (5:30 AM)',
    priceUsd: 95,
    priceEur: 88,
    priceLkr: 28500,
    rating: 4.98,
    reviewsCount: 428,
    sightingsRate: '98.5% Spotting Guarantee',
    badge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1200&q=80',
    description: 'Enter the famous Block 1 of Yala at dawn when leopards are actively hunting and sloth bears emerge from the bush. Accompanied by our Senior Master Tracker.',
    highlights: [
      'Dawn entry advantage for active big cats',
      'High-zoom 20-60x spotting scope included',
      'Gourmet Sri Lanka breakfast picnic in park',
      'Custom 4x4 Land Cruiser with stadium seats'
    ],
    inclusions: [
      'Private 4x4 Modified Safari Jeep',
      'Certified Wildlife Tracker & English Driver',
      'Chilled Beverages & Gourmet Breakfast Box',
      'Park Entrance Ticket Assistance',
      'Complimentary Dust Goggles & Binoculars'
    ],
    maxGuests: 6
  },
  {
    id: 'udawalawe-giant-elephants',
    title: 'Udawalawe Elephant Sanctuary & Lake Sunset',
    park: 'udawalawe',
    parkName: 'Udawalawe National Park',
    tagline: 'Guaranteed 100+ Elephant Herd Sightings',
    duration: '4 Hours',
    timeSlot: 'Dusk Safari (2:30 PM)',
    priceUsd: 75,
    priceEur: 70,
    priceLkr: 22500,
    rating: 4.95,
    reviewsCount: 312,
    sightingsRate: '100% Elephant Guarantee',
    badge: 'Best for Families',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
    description: 'Cruise along the scenic Udawalawe reservoir as hundreds of wild elephants gather at dusk for bathing and social interaction.',
    highlights: [
      'Close encounter with giant tuskers & calves',
      'Spectacular sunset over the reservoir',
      'Ideal birdwatching with 180+ avian species',
      'Spacious open-roof Defender vehicle'
    ],
    inclusions: [
      'Private Safari Jeep & Expert Naturalist',
      'Chilled Fresh King Coconuts & Waters',
      'Hotel Pick-up within Udawalawe area',
      'Children Safety Harnesses'
    ],
    maxGuests: 6
  },
  {
    id: 'wilpattu-ancient-lakes',
    title: 'Wilpattu Grand Wilderness & Willu Safari',
    park: 'wilpattu',
    parkName: 'Wilpattu National Park',
    tagline: 'Deep Forest & Natural Sand-Rimmed Lakes',
    duration: 'Full-Day VIP (5:30 AM - 6:00 PM)',
    timeSlot: 'Full-Day VIP (5:30 AM - 6:00 PM)',
    priceUsd: 165,
    priceEur: 152,
    priceLkr: 49500,
    rating: 4.99,
    reviewsCount: 189,
    sightingsRate: 'Untamed Private Wilderness',
    badge: 'VIP Expedition',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore Sri Lanka’s largest and oldest national park. Famous for pristine natural rainwater lakes (Willus), elusive leopards, sloth bears, and barking deer.',
    highlights: [
      '12-Hour deep wilderness penetration',
      'Zero crowded trails - serene private atmosphere',
      'Hot 3-course BBQ lunch near a secluded lake',
      'Telephoto camera support mounts installed'
    ],
    inclusions: [
      'Luxury VIP Land Cruiser 70-Series',
      '2 Dedicated Crew: Driver + Veteran Naturalist',
      'Breakfast, Hot BBQ Lunch & Afternoon Tea',
      'Ice Cooler & Premium Refreshments',
      'DSLR Camera Gimbal & Sandbag Mounts'
    ],
    maxGuests: 6
  },
  {
    id: 'minneriya-elephant-gathering',
    title: 'Minneriya Elephant Gathering Spectacle',
    park: 'minneriya',
    parkName: 'Minneriya National Park',
    tagline: 'Asia’s Greatest Wildlife Phenomenon',
    duration: '4 Hours',
    timeSlot: 'Dusk Safari (2:30 PM)',
    priceUsd: 80,
    priceEur: 74,
    priceLkr: 24000,
    rating: 4.93,
    reviewsCount: 245,
    sightingsRate: '300+ Elephants Gathering',
    badge: 'Seasonal Highlight',
    image: 'https://images.unsplash.com/photo-1581852017103-68accd5509b6?auto=format&fit=crop&w=1200&q=80',
    description: 'Witness up to 300 Asian elephants converging around the ancient Minneriya tank basin during the dry season grazing spectacle.',
    highlights: [
      'Ranked by Lonely Planet as top wildlife event',
      'High vantage point viewing in open custom jeeps',
      'Expert commentary on elephant herd social behavior',
      'Habarana & Sigiriya hotel transfers included'
    ],
    inclusions: [
      'Customized Hilux Safari Cruiser',
      'Expert Regional Guide',
      'Tropical Fruit Snacks & Cold Drinks',
      'Free Binoculars per seat'
    ],
    maxGuests: 6
  }
];

export const JEEP_FLEET: JeepVehicle[] = [
  {
    id: 'land-cruiser-vip',
    name: 'Wildking Titan VIP (Toyota Land Cruiser 70)',
    tagline: 'The Ultimate Heavy-Duty Safari Beast',
    model: 'Custom 2024 Land Cruiser HZJ79 Heavy Duty',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    capacity: '6 VIP Guests + Driver & Tracker',
    features: [
      'Tiered Stadium Leather Bucket Seats',
      '360° Panoramic Open Safari Roof',
      'Ultra-Smooth Gas Shock Absorbers',
      'Onboard 12V / USB Ultra-Fast Chargers',
      'Built-in Stainless Steel Beverage Cooler'
    ],
    specs: {
      suspension: 'Old Man Emu Heavy Duty Off-Road System',
      seating: 'Custom Diamond-Stitched Ergonomic Seats',
      viewingAngle: 'Unobstructed 360-degree high perspective',
      charging: 'Dual Fast USB-C & USB-A per row',
      amenities: 'Nikon 10x42 Binoculars, Dust Protection Goggles'
    }
  },
  {
    id: 'defender-heritage',
    name: 'Defender Heritage 110 Safari',
    tagline: 'Classic British Adventure Icon',
    model: 'Land Rover Defender 110 Safari Edition',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    capacity: '6 Guests + Driver & Tracker',
    features: [
      'Canvas Roll-up All-Weather Canopy',
      'High Ground Clearance for River Crossings',
      'Acoustic Rubber Sound Proofing',
      'Built-in DSLR Camera Monopod Brackets'
    ],
    specs: {
      suspension: 'Air Ride Expedition Suspension',
      seating: 'Waterproof Canvas Padded Seats',
      viewingAngle: 'Full Open Side & Roof Canopy',
      charging: 'Central Power Hub',
      amenities: 'First-Aid Kit, Emergency Satellite Phone'
    }
  },
  {
    id: 'hilux-safari-spec',
    name: 'Hilux Safari Expedition',
    tagline: 'Agile & Quiet Track Specialist',
    model: 'Toyota Hilux Revo Custom Safari Spec',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    capacity: '6 Guests + Driver & Tracker',
    features: [
      'Whisper-Quiet Turbo Diesel Engine',
      'Elevated Passenger Cabin',
      'Heavy-Duty Front Winch & Tow Equipment',
      'Anti-Glare Matte Jungle Green Finish'
    ],
    specs: {
      suspension: 'Fox Racing Shocks',
      seating: 'Heavy Duty Memory Foam Seats',
      viewingAngle: 'Panoramic Open Sides',
      charging: 'Dual USB Outlets',
      amenities: 'Cold Drinks Refrigerator'
    }
  }
];

export const PARK_DESTINATIONS: ParkDestination[] = [
  {
    id: 'yala',
    name: 'Yala National Park',
    slug: 'yala-national-park',
    tagline: 'The Kingdom of the Sri Lankan Leopard',
    image: 'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=800&q=80',
    primarySpecies: ['Sri Lankan Leopard', 'Sloth Bear', 'Asian Elephant', 'Mugger Crocodile', 'Spot-billed Pelican'],
    bestSeason: 'February to July (Best Waterhole Sightings)',
    keyFact: 'Highest density of wild leopards per square kilometer on Earth.',
    distanceFromColombo: '300 km (approx 4.5 hours drive)'
  },
  {
    id: 'udawalawe',
    name: 'Udawalawe National Park',
    slug: 'udawalawe-national-park',
    tagline: 'Sri Lanka’s Premier Elephant Sanctuary',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80',
    primarySpecies: ['Asian Elephant Herds', 'Water Buffalo', 'Changeable Hawk-Eagle', 'Sambar Deer', 'Monitor Lizard'],
    bestSeason: 'Year-Round (Guaranteed Daily Elephant Encounters)',
    keyFact: 'Home to over 600 wild Asian elephants inhabiting lush grasslands.',
    distanceFromColombo: '180 km (approx 3.5 hours drive)'
  },
  {
    id: 'wilpattu',
    name: 'Wilpattu National Park',
    slug: 'wilpattu-national-park',
    tagline: 'Land of Ancient Lakes & Serene Forests',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80',
    primarySpecies: ['Sloth Bear', 'Leopard', 'Spotted Deer', 'Painted Stork', 'Python'],
    bestSeason: 'May to September',
    keyFact: 'Features over 60 natural sand-rimmed water basins called "Willus".',
    distanceFromColombo: '180 km (approx 3.5 hours drive)'
  },
  {
    id: 'minneriya',
    name: 'Minneriya National Park',
    slug: 'minneriya-national-park',
    tagline: 'Home of the Legendary Elephant Gathering',
    image: 'https://images.unsplash.com/photo-1581852017103-68accd5509b6?auto=format&fit=crop&w=800&q=80',
    primarySpecies: ['Elephant Herds', 'Purple-faced Langur', 'Cormorants', 'Grey Heron'],
    bestSeason: 'July to October (Peak Gathering Season)',
    keyFact: 'Named by CNN as one of the world’s top wildlife natural spectacles.',
    distanceFromColombo: '175 km (approx 3.5 hours drive)'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Marcus & Elena Vance',
    location: 'Zurich, Switzerland',
    date: '3 days ago',
    rating: 5,
    comment: 'We booked the Yala Dawn Patrol with Wildking. Within 45 minutes of entering Block 1, our tracker Chaminda spotted a male leopard sleeping on a high rock branch! The Land Cruiser jeep was so comfortable and clean. The fresh coconut and breakfast picnic in the park was an unforgettable touch.',
    packageBooked: 'Yala Block 1 Exclusive Leopard Expedition',
    sightingTag: 'Leopard & Sloth Bear Spotted',
    sightingPhoto: 'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'rev-2',
    name: 'Dr. Alistair Finch',
    location: 'London, United Kingdom',
    date: '1 week ago',
    rating: 5,
    comment: 'As a wildlife photographer, I needed a jeep with stable camera mounts and an experienced driver who understands animal positioning. Wildking delivered 100%! We got breathtaking low-angle shots of elephant families in Udawalawe.',
    packageBooked: 'Udawalawe Elephant Sanctuary Safari',
    sightingTag: 'Elephant Herd Sighting',
    sightingPhoto: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'rev-3',
    name: 'Sarah & Chloe Tanaka',
    location: 'Tokyo, Japan',
    date: '2 weeks ago',
    rating: 5,
    comment: 'Best tour company in Sri Lanka! Booking online was super easy. The jeep pickup from our Yala hotel arrived exactly at 5:15 AM sharp. We saw leopards, elephants, crocodiles, and peacocks. Truly a VIP treatment!',
    packageBooked: 'Yala Block 1 Exclusive Leopard Expedition',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
  }
];
