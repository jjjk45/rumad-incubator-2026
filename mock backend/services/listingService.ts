import { Listing } from "../../shared/types/all.ts";
import { mockListings } from "../mockData/listings.ts";

const MOCK_DELAY_MS = 50;
async function delay() {
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
  return mockListings.filter((l) => l.sellerID === sellerId);
}

export async function getListingsByCategory(category: string): Promise<Listing[]> {
  await delay();
  return mockListings.filter((l) => l.category === category && l.status === "active");
}
