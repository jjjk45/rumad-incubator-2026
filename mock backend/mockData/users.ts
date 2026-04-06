import { User } from "../../shared/types/all.ts";

export const mockUsers: User[] = [];

const User1: User = {
  id: "0001",
  userName: "jaydenr",
  firstName: "Jayden",
  lastName: "Ramirez",
  email: "jaydenramirez@fakeemail.com",
  school: "School of Arts and Sciences",
  campus: "Busch",
  classYear: "2028",
  sellerRating: 4.3,
  buyerRating: 3.2,
  reviewCount: 3,
  isVerified: true,
  avatar: "jaydenRamirezAvatar3.28.26"
};

const User2: User = {
  id: "0011",
  userName: "ayraa",
  firstName: "Ayra",
  lastName: "Agrawal",
  email: "ayraagrawal@fakeemail.com",
  school: "Rutgers University",
  campus: "Livingston",
  classYear: "2029",
  sellerRating: 4.8,
  buyerRating: 3.5,
  reviewCount: 21,
  isVerified: true,
  avatar: "ayraAgrawalAvatar3.28.26"
};

const User3: User = {
  id: "0100",
  userName: "udayar",
  firstName: "Udaya",
  lastName: "Raja",
  email: "udayaraja@fakeemail.com",
  school: "School of Arts and Sciences",
  campus: "College Ave",
  classYear: "2028",
  sellerRating: 4.5,
  buyerRating: 4.1,
  reviewCount: 12,
  isVerified: false,
  avatar: "udayaRajaAvatar3.28.26"
};

const User4: User = {
  id: "0101",
  userName: "kinshukG",
  firstName: "Kinshuk",
  lastName: "Goel",
  email: "kinshukgoel@fakeemail.com",
  school: "School of Arts and Sciences",
  campus: "Busch",
  classYear: "2028",
  sellerRating: 4.5,
  buyerRating: 4.1,
  reviewCount: 12,
  isVerified: false,
  avatar: "kinshukGoelAvatar3.28.26"
};

mockUsers.push(User1, User2, User3, User4);