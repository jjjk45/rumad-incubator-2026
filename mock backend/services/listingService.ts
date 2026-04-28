import { Listing, CreateListingInput, UpdateListingInput } from "../../shared/types/all";
import { mockListings } from "../mockData/listings";
import { generateId } from "../utils/generateId";
import { ApiError } from "../api/errors";

const MOCK_DELAY_MS = 50;//simulate network time, we obviously wont use this in the real service
function delay() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

export async function getAllListings(): Promise<Listing[]> {
  await delay();
  return mockListings.filter((l) => l.status === "active");
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  await delay();
  return mockListings.find((l) => l.id === id);
}

export async function getListingsBySeller(sellerId: string): Promise<Listing[]> {
  await delay();
  return mockListings.filter((l) => l.sellerId === sellerId);
}

export async function getListingsByCategory(category: string): Promise<Listing[]> {
  await delay();
  return mockListings.filter((l) => l.category === category && l.status === "active");
}

export async function createListing(sellerId: string, input: CreateListingInput): Promise<Listing> {
  await delay();
  const newListing: Listing = {
    ...input,
    id: generateId(),
    sellerId,
    timePosted: Date.now(),
    status: 'active',
  };
  mockListings.push(newListing);
  return newListing;
}

export async function updateListing(id: string, sellerId: string, input: UpdateListingInput): Promise<Listing> {
  await delay();
  const index = mockListings.findIndex((l) => l.id === id);
  if (index === -1) throw new ApiError(404, `Listing ${id} not found`);
  if (mockListings[index].sellerId !== sellerId) throw new ApiError(403, "Forbidden");
  mockListings[index] = { ...mockListings[index], ...input };
  return mockListings[index];
}

export async function deleteListing(id: string, sellerId: string): Promise<void> {
  await delay();
  const index = mockListings.findIndex((l) => l.id === id);
  if (index === -1) throw new ApiError(404, `Listing ${id} not found`);
  if (mockListings[index].sellerId !== sellerId) throw new ApiError(403, "Forbidden");
  mockListings.splice(index, 1);
}
