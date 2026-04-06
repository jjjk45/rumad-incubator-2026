export type Campus = 'Livingston' | 'Busch' | 'College Ave' | 'Cook' | 'Douglass';
export type ListingStatus = 'active' | 'sold' | 'pending';
export type ListingCondition = 'Like New' | 'Good' | 'Fair' | 'Beat Up';
export type CategoryName = 'Textbooks' | 'Appliances' | 'Electronics' | 'Furniture' | 'Clothing & Accessories' | 'Other';

export interface UserPublic {
  id: string;
  userName: string;
  school: string;
  campus: Campus;
  classYear: string;
  sellerRating: number | 'N/A';
  buyerRating: number | 'N/A';
  reviewCount: number;
  isVerified: boolean;
  avatar?: string;
}

// backend type
export interface User extends UserPublic {
  location?: { lat: number; long: number };
  email: string;
  firstName: string;
  lastName: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  category: CategoryName;
  images: string[];
  sellerId: string;
  campus: Campus;
  locationPrecise?: { lat: number; long: number };
  timePosted: number; // Unix ms
  status: ListingStatus;
  isOpenToTrade: boolean;
  isNegotiable: boolean;
  badge?: string;
}

// use with frontend
export interface ListingLocal extends Listing {
  distance?: number; // distance from locationPrecise, use haversine formula
}

export interface Chat {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessageId?: string; // undefined if new chat
  lastMessageTime?: number; // Unix ms
  tradeStatus?: 'pending' | 'accepted' | 'declined' | 'completed';
  listingImage?: string;
  totalMessageCount: number;
}

// use with frontend
export interface ChatLocal extends Chat {
  otherUserId: string; // whichever of user1Id/user2Id is not the current user
  otherUserName: string;
  unreadCount: number; // local/per-user, not stored on Chat itself
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number; // Unix ms
  isRead: boolean;
}

export interface Category {
  id: string;
  name: CategoryName;
  image: string;
}

// Input types for mutations
// frontend sends these, server assigns the rest

export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  condition: ListingCondition;
  category: CategoryName;
  images: string[];
  campus: Campus;
  locationPrecise?: { lat: number; long: number };
  isOpenToTrade: boolean;
  isNegotiable: boolean;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  condition?: ListingCondition;
  category?: CategoryName;
  images?: string[];
  campus?: Campus;
  locationPrecise?: { lat: number; long: number };
  isOpenToTrade?: boolean;
  isNegotiable?: boolean;
  status?: ListingStatus;
}

export interface UpdateUserInput {
  userName?: string;
  school?: string;
  campus?: Campus;
  classYear?: string;
  avatar?: string;
  location?: { lat: number; long: number };
}

export interface SendMessageInput {
  content: string;
}
