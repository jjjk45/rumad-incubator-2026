/**
 * Type definitions for RU Thrift App
 */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  classYear: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  avatar?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'Like New' | 'Good' | 'Fair';
  category: string;
  images: string[];
  seller: User;
  location: string;
  distance: string;
  postedAt: string;
  status: 'active' | 'sold' | 'pending';
  isOpenToTrade: boolean;
  isNegotiable: boolean;
  badge?: string;
}

export interface Chat {
  id: string;
  otherUser: User;
  lastMessage: string;
  lastMessageTime: string;
  isActiveTrade: boolean;
  tradeStatus?: string;
  listingImage?: string;
  unreadCount: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export type TabRoute = 'Explore' | 'Sell' | 'Activity' | 'Account';

export interface NavItem {
  route: TabRoute;
  label: string;
  icon: string;
}
