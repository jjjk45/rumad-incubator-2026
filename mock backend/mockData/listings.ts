import { Listing } from "../../shared/types/all";

const Listing1: Listing = {
  id: "L0001",
  title: "Calculus: Early Transcendentals (10th Ed)",
  description: "Used for one semester, some highlighting in chapters 1-3 but otherwise clean. Comes with access code (unused).",
  price: 45,
  condition: "Good",
  category: "Textbooks",
  images: ["calcTextbook_front.jpg", "calcTextbook_back.jpg"],
  sellerId: "0001",
  campus: "Busch",
  timePosted: 1743328500000,
  status: "active",
  isOpenToTrade: false,
  isNegotiable: true,
};

const Listing2: Listing = {
  id: "L0002",
  title: "Mini Fridge - 3.2 cu ft",
  description: "Perfect dorm fridge. Used for two years, works perfectly. Pickup only from Livingston campus.",
  price: 60,
  condition: "Good",
  category: "Appliances",
  images: ["miniFridge1.jpg", "miniFridge2.jpg", "miniFridge3.jpg"],
  sellerId: "0011",
  campus: "Livingston",
  timePosted: 1743512400000,
  status: "active",
  isOpenToTrade: true,
  isNegotiable: true,
  badge: "Popular",
};

const Listing3: Listing = {
  id: "L0003",
  title: "TI-84 Plus CE Graphing Calculator",
  description: "Barely used, battery life is great. Includes charging cable and case.",
  price: 80,
  condition: "Like New",
  category: "Electronics",
  images: ["ti84_front.jpg"],
  sellerId: "0100",
  campus: "College Ave",
  timePosted: 1743156000000,
  status: "active",
  isOpenToTrade: false,
  isNegotiable: false,
};

const Listing4: Listing = {
  id: "L0004",
  title: "Organic Chemistry I & II Bundle",
  description: "Both Clayden textbooks plus a Mechanisms in Organic Chemistry workbook. Sold as a set only.",
  price: 70,
  condition: "Fair",
  category: "Textbooks",
  images: ["orchem1.jpg", "orchem2.jpg"],
  sellerId: "0101",
  campus: "Busch",
  timePosted: 1743594600000,
  status: "active",
  isOpenToTrade: true,
  isNegotiable: true,
};

const Listing5: Listing = {
  id: "L0005",
  title: "Wooden Loft Bed Frame (Twin XL)",
  description: "Fits standard dorm mattress. Disassembles easily for transport. Selling because I'm moving off campus.",
  price: 120,
  condition: "Good",
  category: "Furniture",
  images: ["loftBed1.jpg", "loftBed2.jpg"],
  sellerId: "0001",
  campus: "Livingston",
  timePosted: 1743698700000,
  status: "pending",
  isOpenToTrade: false,
  isNegotiable: true,
};

const Listing6: Listing = {
  id: "L0006",
  title: "Mechanical Keyboard - Keychron K6",
  description: "Compact 65% layout, brown switches. Light use, great for studying. Includes original box.",
  price: 55,
  condition: "Like New",
  category: "Electronics",
  images: ["keychron1.jpg", "keychron2.jpg"],
  sellerId: "0011",
  campus: "College Ave",
  timePosted: 1743760800000,
  status: "active",
  isOpenToTrade: true,
  isNegotiable: false,
  badge: "New",
};

const Listing7: Listing = {
  id: "L0007",
  title: "Backpack - JanSport SuperBreak",
  description: "Used for one year, still solid. Small scuff on the bottom but zippers work perfectly.",
  price: 15,
  condition: "Fair",
  category: "Clothing & Accessories",
  images: ["jansport1.jpg"],
  sellerId: "0100",
  campus: "Cook",
  timePosted: 1742911200000,
  status: "sold",
  isOpenToTrade: false,
  isNegotiable: false,
};

const Listing8: Listing = {
  id: "L0008",
  title: "Desk Lamp with USB Charging Port",
  description: "3 brightness levels, warm/cool/daylight modes. USB-A port on the base. Works great.",
  price: 18,
  condition: "Good",
  category: "Appliances",
  images: ["deskLamp1.jpg", "deskLamp2.jpg"],
  sellerId: "0101",
  campus: "Busch",
  timePosted: 1743793200000,
  status: "active",
  isOpenToTrade: false,
  isNegotiable: true,
};

export const mockListings: Listing[] = [Listing1, Listing2, Listing3, Listing4, Listing5, Listing6, Listing7, Listing8];
