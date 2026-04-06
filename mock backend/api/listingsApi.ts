import { Listing, CreateListingInput, UpdateListingInput } from "../../shared/types/all.ts";
import {
  getAllListings,
  getListingById,
  getListingsByCategory,
  getListingsBySeller,
  createListing,
  updateListing,
  deleteListing,
} from "../services/listingService.ts";
import { ApiError } from "./errors.ts";
import { mockAuth } from "../services/mockAuth.ts";

// GET /listings
export async function fetchAllListings(): Promise<Listing[]> {
  return getAllListings();
}

// GET /listings/:id
export async function fetchListingById(id: string): Promise<Listing> {
  const listing = await getListingById(id);
  if (!listing) throw new ApiError(404, `Listing ${id} not found`);
  return listing;
}

// GET /listings?category=:category
export async function fetchListingsByCategory(category: string): Promise<Listing[]> {
  return getListingsByCategory(category);
}

// GET /users/:sellerId/listings
export async function fetchListingsBySeller(sellerId: string): Promise<Listing[]> {
  return getListingsBySeller(sellerId);
}

// GET /me/listings
export async function fetchMyListings(): Promise<Listing[]> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return getListingsBySeller(userId);
}

// POST /listings
export async function postCreateListing(input: CreateListingInput): Promise<Listing> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return createListing(userId, input);
}

// PATCH /listings/:id
export async function patchListing(id: string, input: UpdateListingInput): Promise<Listing> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return updateListing(id, userId, input);
}

// DELETE /listings/:id
export async function deleteListingById(id: string): Promise<void> {
  const userId = mockAuth.getId();
  if (!userId) throw new ApiError(401, "Unauthorized");
  return deleteListing(id, userId);
}
