import { useCallback, useEffect, useState } from "react";
import { Listing, CreateListingInput, UpdateListingInput } from "../../shared/types/all.ts";
import {
  fetchAllListings,
  fetchListingById,
  fetchListingsByCategory,
  fetchListingsBySeller,
  fetchMyListings,
  postCreateListing,
  patchListing,
  deleteListingById,
} from "../api/listingsApi.ts";
import { ApiError } from "../api/errors.ts";

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
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    fetchMyListings()
      .then(setListings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { listings, loading, error, isUnauthorized: error?.status === 401 };
}

export function useCreateListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const create = useCallback(async (input: CreateListingInput): Promise<Listing> => {
    setLoading(true);
    setError(null);
    try {
      return await postCreateListing(input);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const update = useCallback(async (id: string, input: UpdateListingInput): Promise<Listing> => {
    setLoading(true);
    setError(null);
    try {
      return await patchListing(id, input);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteListing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const remove = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteListingById(id);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { remove, loading, error };
}
