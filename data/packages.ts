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
  safetyFeatures?: string[];
  maxGuests: number;
}

export interface JeepVehicle {
  id: string;
  name: string;
  tagline: string;
  model: string;
  image: string;
  images?: string[];
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
  description?: string;
  areaKm2?: string;
  establishedYear?: string;
  gates?: string[];
  operatingHours?: string;
  highlights?: string[];
  gallery?: string[];
  wildlifeGuide?: {
    name: string;
    description: string;
    sightingSpot: string;
  }[];
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
    safetyFeatures: [
      'Heavy-Duty Steel Roll Cages (Anti-Topple Certified Frame)',
      'Individual 3-Point Ergonomic Seatbelts for All Seats',
      'Certified Wilderness First-Aid & Emergency Medical Kit',
      'Satellite GPS Live Tracker & DWC Ranger Emergency Radio',
      'High-Visibility Dust Protection Goggles & Child Harnesses'
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
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
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
    safetyFeatures: [
      'Heavy-Duty Steel Roll Cages & Reinforced Bull Bars',
      '3-Point Off-Road Seatbelts on All Elevated Seats',
      'Certified Wilderness First-Aid & Snakebite Emergency Kit',
      'VHF High-Frequency Ranger Radio & Live Satellite Tracking',
      'Complimentary Child Safety Harnesses & Eye Dust Protection'
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
    safetyFeatures: [
      'Heavy-Duty Steel Roll Cage Frame & Padded Grab Bars',
      '3-Point Ergonomic Seatbelts per Seat Row',
      'First-Aid Kit & Certified CPR Trained Driver/Tracker',
      'Isofix Child Safety Anchors & Specialized Youth Harnesses',
      'Onboard VHF Radio & Direct Park Emergency Rescue Link'
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
    safetyFeatures: [
      'Heavy-Duty 70-Series Steel Roll Cages & Skid Plates',
      '3-Point Individual Off-Road Seatbelts for All Guests',
      'Deep Wilderness Trauma First-Aid & Oxygen Emergency Kit',
      'Dual Satellite Emergency Tracker & DWC Ranger Radio',
      'Child Safety Harnesses & Anti-Dust Eye Protection'
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
    safetyFeatures: [
      'Heavy-Duty Reinforced Steel Roll Cage Structure',
      '3-Point Passenger Seatbelts on Every Seat',
      'Complete Wilderness First-Aid & Medical Supplies',
      'Live GPS Location Beacon & Park Ranger Emergency Channel',
      'Complimentary UV Protection Dust Goggles & Child Harnesses'
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
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
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
    distanceFromColombo: '300 km (approx 4.5 hours drive)',
    description: 'Yala National Park is Sri Lanka’s most visited and second largest national park, bordering the Indian Ocean in the southeastern region of the island. Spanning over 979 square kilometers, Yala encompasses diverse ecosystems ranging from moist monsoon forests and dry thorn scrublands to freshwater wetlands and coastal lagoons. Renowned globally for having the highest concentration of wild leopards (Panthera pardus kotiya) on Earth, Yala Block 1 offers extraordinary opportunities to observe elusive big cats, sloth bears, Asian elephants, and over 215 species of birds.',
    areaKm2: '979 km²',
    establishedYear: '1938',
    operatingHours: '6:00 AM – 6:00 PM (Daily)',
    gates: ['Palatupana Gate (Main Block 1)', 'Katagamuwa Gate (Block 2)', 'Galge Gate (Block 3 & 5)'],
    highlights: [
      'Highest density of leopards in the world in Block 1',
      'Picturesque coastal scenery meeting savanna thorn forests',
      'Patuwalu & Sithulpawwa ancient monastery heritage sites within park boundaries',
      'Rich wetland avian diversity across coastal lagoons'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80'
    ],
    wildlifeGuide: [
      {
        name: 'Sri Lankan Leopard',
        description: 'The apex predator of Sri Lanka. Frequently spotted resting on high rocky outcrops or hunting along dusty trails.',
        sightingSpot: 'Block 1 - Patanangala & Heenwewa'
      },
      {
        name: 'Sloth Bear',
        description: 'Shy and nocturnal, sloth bears are actively seen during the Palu fruit season (May - July).',
        sightingSpot: 'Galge & Block 1 Scrub Forest'
      },
      {
        name: 'Asian Elephant',
        description: 'Solitary tuskers and family herds roaming between waterholes and coastal scrubland.',
        sightingSpot: 'Buthawa & Sithulpawwa Corridors'
      }
    ]
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
    distanceFromColombo: '180 km (approx 3.5 hours drive)',
    description: 'Udawalawe National Park lies on the boundary of Sabaragamuwa and Uva Provinces, created to provide a sanctuary for wild animals displaced by the construction of the Udawalawe Reservoir on the Walawe River. Spanning 308 square kilometers, Udawalawe is widely considered one of the best places in Asia to see wild elephants up close in their natural habitat. With its open savanna-like grasslands and scenic lake backdrop, herds of elephants, water buffalos, sambar deer, and majestic raptors are easily spotted on any safari drive.',
    areaKm2: '308 km²',
    establishedYear: '1972',
    operatingHours: '6:00 AM – 6:00 PM (Daily)',
    gates: ['Main Entrance Gate (Udawalawe Reservoir Road)'],
    highlights: [
      'Guaranteed close-up encounters with herds of Asian elephants',
      'Vast open grasslands providing unobstructed 360-degree photography vistas',
      'Udawalawe Reservoir birdwatching with eagles, storks, and pelicans',
      'Proximity to the Udawalawe Elephant Transit Home'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581852017103-68accd5509b6?auto=format&fit=crop&w=1200&q=80'
    ],
    wildlifeGuide: [
      {
        name: 'Asian Elephant Herds',
        description: 'Resident herds of over 600 wild elephants, including adorable calves bathing in the reservoir at dusk.',
        sightingSpot: 'Udawalawe Reservoir Basin & Grasslands'
      },
      {
        name: 'Wild Water Buffalo',
        description: 'Large herds resting in mud wallows and shallow marshlands throughout the park.',
        sightingSpot: 'Walawe River Marshes'
      },
      {
        name: 'Changeable Hawk-Eagle',
        description: 'Formidable raptor frequently seen perched on high dead trees scanning for prey.',
        sightingSpot: 'Open Savanna Trees'
      }
    ]
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
    distanceFromColombo: '180 km (approx 3.5 hours drive)',
    description: 'Wilpattu National Park is Sri Lanka’s largest and oldest national park, situated on the northwest coast near Anuradhapura. Covering 1,317 square kilometers, Wilpattu is world-renowned for its unique feature: over 60 natural, sand-rimmed water basins known as "Willus". The park’s dense dry zone forests and serene lake basins offer an exclusive, uncrowded wilderness experience where elusive Sri Lankan leopards, sloth bears, spotted deer, and barking deer thrive in tranquil privacy.',
    areaKm2: '1,317 km²',
    establishedYear: '1938',
    operatingHours: '6:00 AM – 6:00 PM (Daily)',
    gates: ['Hunuwilagama Main Gate', 'Eluwankulama Gate (West Entrance)'],
    highlights: [
      'Sri Lanka’s largest national park with 60+ natural Willu lakes',
      'Serene, peaceful safari trails with low vehicle density',
      'High probability of sloth bear sightings around sand basins',
      'Rich historical legacy dating back to Prince Vijaya’s landing at Kudiramalai Point'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547970810-dc0eac25ee85?auto=format&fit=crop&w=1200&q=80'
    ],
    wildlifeGuide: [
      {
        name: 'Sloth Bear',
        description: 'Wilpattu is famed for its sloth bear population roaming the soft sand trails surrounding natural lakes.',
        sightingSpot: 'Kumbuk Wewa & Mahawilachchiya Track'
      },
      {
        name: 'Sri Lankan Leopard',
        description: 'Large male leopards frequently use the soft white sand trails as their territory highways.',
        sightingSpot: 'Kokkare & Lunu Wewa Willus'
      },
      {
        name: 'Spotted Deer (Axis Deer)',
        description: 'Vast herds grazing peaceably along lake fringes surrounded by dense green forest canopy.',
        sightingSpot: 'Main Willu Circuit'
      }
    ]
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
    distanceFromColombo: '175 km (approx 3.5 hours drive)',
    description: 'Minneriya National Park is located in the North Central Province of Sri Lanka. Built around the ancient 3rd-century Minneriya Reservoir constructed by King Mahasen, the park spans 88 square kilometers. Minneriya is world-famous for "The Gathering" — an extraordinary natural phenomenon occurring during the dry season (July to October) when over 300 wild Asian elephants assemble along the receding shores of the reservoir for fresh grass, social interaction, and water.',
    areaKm2: '88 km²',
    establishedYear: '1997',
    operatingHours: '6:00 AM – 6:00 PM (Daily)',
    gates: ['Minneriya Main Gate (Habarana - Polonnaruwa Road)'],
    highlights: [
      'Asia’s largest recurring gathering of wild Asian elephants',
      'Historic 3rd-century Minneriya Tank built by King Mahasen',
      'Spectacular avian sightings including thousands of cormorants & pelicans',
      'Convenient central location near Cultural Triangle attractions (Sigiriya & Dambulla)'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1581852017103-68accd5509b6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80'
    ],
    wildlifeGuide: [
      {
        name: 'The Great Elephant Gathering',
        description: 'Up to 300+ elephants converging around the green grassy reservoir bed at golden hour.',
        sightingSpot: 'Minneriya Tank Shoreline'
      },
      {
        name: 'Purple-faced Langur',
        description: 'Endemic primate species inhabiting the high forest canopy bordering the tank.',
        sightingSpot: 'Park Entrance Forest Track'
      },
      {
        name: 'Little Cormorant & Water Birds',
        description: 'Dense colonies of water birds fishing along the shallow waters of the ancient reservoir.',
        sightingSpot: 'Tank Marshlands'
      }
    ]
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
