import { Listing } from "../../shared/types/all.ts";
import {
  getAllListings,
  getListingById,
  getListingsByCategory,
  getListingsBySeller,
} from "../services/listingService.ts";
import { ApiError } from "./errors.ts";

// Real backend equivalent: GET /listings
export async function fetchAllListings(): Promise<Listing[]> {
  return getAllListings();
}

// Real backend equivalent: GET /listings/:id
export async function fetchListingById(id: string): Promise<Listing> {
  const listing = await getListingById(id);
  if (!listing) throw new ApiError(404, `Listing ${id} not found`);
  return listing;
}

// Real backend equivalent: GET /listings?category=:category
export async function fetchListingsByCategory(category: string): Promise<Listing[]> {
  return getListingsByCategory(category);
}

// Real backend equivalent: GET /users/:sellerId/listings
export async function fetchListingsBySeller(sellerId: string): Promise<Listing[]> {
  return getListingsBySeller(sellerId);
}
