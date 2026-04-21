export type TabRoute = 'Explore' | 'Sell' | 'Activity' | 'Account';

export interface NavItem {
  route: TabRoute;
  label: string;
  icon: string;
}

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
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  category: string;
  images: string[];
  seller: User;
  location: string;
  distance: string;
  postedAt: string;
  status: string;
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
