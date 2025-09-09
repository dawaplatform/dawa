// icons.tsx
import React from 'react';

// ======================================================
// Categories (using colorful icons from react-icons/fc)
// ======================================================
import {
  FcAutomotive,
  FcHome,
  FcSmartphoneTablet,
  FcCamcorderPro,
  FcDepartment,
  FcBiotech,
  FcCloth,
  FcSportsMode,
  FcBusiness,
  FcServices,
  FcManager,
  FcReddit,
  FcLandscape,
  FcFactory,
  FcSupport,
  FcBinoculars,
} from 'react-icons/fc';
import { PiDogDuotone } from 'react-icons/pi';

//
// Universal fallback icon (for categories)
//
export const UniversalFallbackIcon = FcServices;

//
// Category Icon Map (using react-icons/fc)
//
export const categoryIconMap: Record<string, React.ElementType> = {
  Vehicles: FcAutomotive, // Better represents vehicles than FcInTransit
  Property: FcHome,
  'Phones & Tablets': FcSmartphoneTablet,
  Electronics: FcCamcorderPro,
  'Home, Appliances & Furniture': FcDepartment,
  'Health & Beauty': FcBiotech, // Chosen for its association with health
  Fashion: FcCloth,
  'Sports, Arts & Outdoors': FcSportsMode,
  'Seeking Work CVs': FcBusiness,
  Services: FcServices,
  Jobs: FcManager,
  'Babies & Kids': FcReddit,
  Pets: PiDogDuotone, // Limited choice within this icon set
  'Agriculture & Food': FcLandscape,
  'Commercial Equipment & Tools': FcFactory,
  'Repair & Construction': FcSupport, // Best available match
  'Tours And Travel': FcBinoculars,
};

// ======================================================
// Subcategories (using mostly Material Design icons from react-icons/md
// with a few from react-icons/fa for pet-related icons so each subcategory is unique)
// ======================================================
import {
  // Vehicles
  MdDriveEta,
  MdTwoWheeler, // <-- Use MdTwoWheeler instead of MdMotorcycle
  MdLocalShipping,
  MdDirectionsBus,
  MdBuild,
  MdDirectionsCar,
  // Property
  MdHome,
  MdApartment,
  MdLandscape,
  MdTerrain,
  MdBusiness,
  MdBusinessCenter,
  MdLocationCity,
  // Phones & Tablets
  MdSmartphone,
  MdTablet,
  MdHeadset,
  MdPhoneAndroid,
  // Electronics
  MdTv,
  MdMusicNote,
  MdCameraAlt,
  MdComputer,
  MdHeadsetMic,
  MdGames,
  MdDevices,
  // Home, Appliances & Furniture
  MdWeekend,
  MdKitchen,
  MdRestaurant,
  MdLocalFlorist,
  MdNature,
  MdOutlineHome,
  // Health & Beauty
  MdFace,
  MdSettings,
  MdLocalOffer,
  MdContentCut,
  MdSpa,
  MdFavorite,
  // Fashion
  MdCheckroom,
  MdDirectionsWalk,
  MdShoppingBag,
  MdDiamond,
  MdWatch,
  MdStyle,
  // Sports, Arts & Outdoors
  MdSportsSoccer,
  MdQueueMusic,
  MdPalette,
  MdLocalFireDepartment,
  MdDirectionsBike,
  MdEmojiEvents,
  // Seeking Work CVs
  MdWork,
  MdAssignmentInd,
  // Services
  MdBuildCircle,
  MdEvent,
  MdFaceRetouchingNatural,
  MdCarRepair,
  MdCleanHands,
  MdMiscellaneousServices,
  // Jobs
  MdWorkOutline,
  MdWorkHistory,
  // Babies & Kids
  MdChildCare,
  MdChildFriendly,
  MdAccessible,
  MdAccessibilityNew,
  MdEventSeat,
  MdEmojiEmotions,
  // Pets (most from md; some from fa for unique icons)
  MdPets,
  // Agriculture & Food
  MdAgriculture,
  MdEco,
  MdLocalGroceryStore,
  MdRestaurantMenu,
  MdFastfood,
  // Commercial Equipment & Tools
  MdFactory,
  MdFoodBank,
  MdStore,
  MdFireplace,
  MdPrint,
  MdExtension,
  // Repair & Construction
  MdHomeRepairService,
  MdElectricalServices,
  MdWaterDamage,
  MdSecurity,
  MdConstruction,
} from 'react-icons/md';
import { CgMoreO } from 'react-icons/cg';
import {
  FaCat,
  FaDove,
  FaFish,
  FaPaw,
  FaBone,
  FaDrumstickBite,
  FaBus,
  FaHotel,
} from 'react-icons/fa';

//
// Subcategory Icon Map (each subcategory gets its own unique icon)
//
export const subcategoryIconMap: Record<string, React.ElementType> = {
  // --- Vehicles ---
  Cars: MdDriveEta,
  'Motorcycles & Scooters': MdTwoWheeler, // updated icon here
  'Trucks & Trailers': MdLocalShipping,
  Buses: MdDirectionsBus,
  'Vehicle Parts & Accessories': MdBuild,
  'Other Vehicles': MdDirectionsCar,

  // --- Property ---
  'Houses & Apartments for Sale': MdHome,
  'Houses & Apartments for Rent': MdApartment,
  'Land & Plots for Sale': MdLandscape,
  'Land & Plots for Rent': MdTerrain,
  'Commercial Property for Sale': MdBusiness,
  'Commercial Property for Rent': MdBusinessCenter,
  'Other Property': MdLocationCity,

  // --- Phones & Tablets ---
  'Mobile Phones': MdSmartphone,
  Tablets: MdTablet,
  'Accessories for Mobile Phones & Tablets': MdHeadset,
  'Other Phones & Tablets': MdPhoneAndroid,

  // --- Electronics ---
  TVs: MdTv,
  'Audio & Music Equipment': MdMusicNote,
  'Cameras, Video Cameras & Accessories': MdCameraAlt,
  'Computer Accessories': MdComputer,
  Headphones: MdHeadsetMic,
  'Video Games & Consoles': MdGames,
  'Other Electronics': MdDevices,

  // --- Home, Appliances & Furniture ---
  Furniture: MdWeekend,
  'Home Appliances': MdKitchen,
  'Kitchen & Dining': MdRestaurant,
  'Home Accessories': MdLocalFlorist,
  Garden: MdNature,
  'Other Home, Appliances & Furniture': MdOutlineHome,

  // --- Health & Beauty ---
  Makeup: MdFace,
  'Tools & Accessories': MdSettings,
  Fragrance: MdLocalOffer,
  'Hair Beauty': MdContentCut,
  'Skin Care': MdSpa,
  'Other Health & Beauty': MdFavorite,

  // --- Fashion ---
  Clothing: MdCheckroom,
  Shoes: MdDirectionsWalk,
  Bags: MdShoppingBag,
  Jewelry: MdDiamond,
  Watches: MdWatch,
  'Other Fashion': MdStyle,

  // --- Sports, Arts & Outdoors ---
  'Sports Equipment': MdSportsSoccer,
  'Musical Instruments': MdQueueMusic,
  'Arts & Crafts': MdPalette,
  'Camping Gear': MdLocalFireDepartment,
  Bicycles: MdDirectionsBike,
  'Other Sports, Arts & Outdoors': MdEmojiEvents,

  // --- Seeking Work CVs ---
  "Job Seekers' CVs": MdWork,
  'Other Seeking Work CVs': MdAssignmentInd,

  // --- Services ---
  'Repair Services': MdBuildCircle,
  'Event Planning & Services': MdEvent,
  'Health & Beauty Services': MdFaceRetouchingNatural,
  'Automotive Services': MdCarRepair,
  'Cleaning Services': MdCleanHands,
  'Other Services': MdMiscellaneousServices,

  // --- Jobs ---
  'Job Vacancies': MdWorkOutline,
  'Other Jobs': MdWorkHistory,

  // --- Babies & Kids ---
  "Children's Clothing": MdChildCare,
  Toys: MdChildFriendly,
  'Baby & Child Care': MdAccessible,
  'Prams & Strollers': MdAccessibilityNew,
  "Children's Furniture": MdEventSeat,
  'Other Babies & Kids': MdEmojiEmotions,

  // --- Pets ---
  'Dogs & Puppies': MdPets,
  'Cats & Kittens': FaCat,
  Birds: FaDove,
  Fish: FaFish,
  'Pet Accessories': FaPaw,
  'Other Pets': FaBone,

  // --- Agriculture & Food ---
  'Farm Machinery & Equipment': MdAgriculture,
  'Livestock & Poultry': FaDrumstickBite,
  'Crops & Seeds': MdEco,
  'Feeds, Supplements & Seeds': MdLocalGroceryStore,
  'Meals & Drinks': MdRestaurantMenu,
  'Other Agriculture & Food': MdFastfood,

  // --- Commercial Equipment & Tools ---
  'Manufacturing Equipment': MdFactory,
  'Restaurant & Catering Equipment': MdFoodBank,
  'Store Equipment': MdStore,
  'Industrial Ovens': MdFireplace,
  'Printing Equipment': MdPrint,
  'Other Commercial Equipment & Tools': MdExtension,

  // --- Repair & Construction ---
  'Building Materials': MdHomeRepairService,
  'Electrical Equipment': MdElectricalServices,
  'Plumbing & Water Supply': MdWaterDamage,
  'Hand Tools': MdBuild,
  'Safety Equipment': MdSecurity,
  'Other Repair & Construction': MdConstruction,

  // --- Tours & Travel ---
  'Travel Agents & Services': FaBus,
  'Accommodation & Transport': FaHotel,
  'Other Tours And Travel': CgMoreO,
};
