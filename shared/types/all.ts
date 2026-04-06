export interface UserPublic {
  id: string; //need to decide on our uuid format
  userName: string;
  school: string;
  campus: 'Livingston' | 'Busch' | 'College Ave' | 'Cook' | 'Douglass' //ask users what campus they are closest to on signup
  classYear: string;
  seller_rating: number | 'N/A';
  buyer_rating: number | 'N/A';
  reviewCount: number;
  isVerified: boolean; //need to implement verification
  avatar?: string;
}

//backend type
export interface User extends UserPublic {
  location?: string //ASK to store, latitude longitude
  email: string;
  firstName: string;
  lastName: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'Like New' | 'Good' | 'Fair' | 'Beat Up';
  category: string;
  images: string[];
  sellerID: string;
  campus: string;
  locationPrecise?: string; //latitude longitude
  timePosted: number; // Unix ms
  status: 'active' | 'sold' | 'pending';
  isOpenToTrade: boolean;
  isNegotiable: boolean;
  badge?: string; //this may be nonsense
}

//use with frontend
export interface ListingLocal {
  distance?: number; //distance from <locationPrecise>, use haversine formula
}

export interface Chat {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessage?: string; // undefined if new chat
  lastMessageTime?: number; // Unix ms
  isActiveTrade: boolean;
  tradeStatus?: 'pending' | 'accepted' | 'declined' | 'completed';
  listingImage?: string;
  totalMessageCount: number;
}

//use with frontend
export interface ChatLocal extends Chat {
  otherUserId: string; // whichever of user1Id/user2Id is not the current user
  otherUserName: string;
  unreadCount: number; // local/per-user, not stored on Chat itself
}

export interface Category {
  id: string;
  name: string;
  image: string;
}