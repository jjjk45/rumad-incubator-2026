import { useEffect, useState } from "react";
import { Listing } from "../../shared/types/all.ts";
import {
  fetchAllListings,
  fetchListingById,
  fetchListingsByCategory,
  fetchListingsBySeller,
} from "../api/listingsApi.ts";
import { ApiError } from "../api/errors.ts";
import { useAuth } from "./authHook.ts";

export function useAllListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchAllListings()
      .then(setListings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { listings, loading, error };
}

export function useListing(id: string) {
  const [listing, setListing] = useState<Listing | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchListingById(id)
      .then(setListing)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { listing, loading, error, notFound: error?.status === 404 };
}

export function useListingsByCategory(category: string) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchListingsByCategory(category)
      .then(setListings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [category]);

  return { listings, loading, error };
}

export function useListingsBySeller(sellerId: string) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchListingsBySeller(sellerId)
      .then(setListings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [sellerId]);

  return { listings, loading, error };
}

export function useMyListings() {
  const { userId } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchListingsBySeller(userId)
      .then(setListings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { listings, loading, error, isUnauthorized: !userId };
}
