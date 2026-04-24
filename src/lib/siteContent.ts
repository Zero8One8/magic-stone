import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type SiteContentKey =
  | "site_links"
  | "site_shop_products"
  | "site_services"
  | "site_faq"
  | "site_blog"
  | "site_crystal_of_day";

const contentCache = new Map<string, unknown>();
const inFlightRequests = new Map<string, Promise<unknown>>();
const STORAGE_PREFIX = "site-content-cache:";
const STORAGE_TTL_MS = 1000 * 60 * 15;

type StoredSiteContent = {
  value: unknown;
  cachedAt: number;
};

function readStoredContent<T>(contentKey: SiteContentKey): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${contentKey}`);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredSiteContent;
    if (Date.now() - parsed.cachedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${contentKey}`);
      return null;
    }

    return parsed.value as T;
  } catch {
    return null;
  }
}

function writeStoredContent(contentKey: SiteContentKey, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: StoredSiteContent = {
      value,
      cachedAt: Date.now(),
    };

    window.localStorage.setItem(`${STORAGE_PREFIX}${contentKey}`, JSON.stringify(payload));
  } catch {
    // Ignore storage quota and serialization failures.
  }
}

export async function fetchSiteContent<T>(contentKey: SiteContentKey, fallback: T): Promise<T> {
  if (contentCache.has(contentKey)) {
    return contentCache.get(contentKey) as T;
  }

  const storedValue = readStoredContent<T>(contentKey);
  if (storedValue !== null) {
    contentCache.set(contentKey, storedValue);
    return storedValue;
  }

  if (!inFlightRequests.has(contentKey)) {
    const request = supabase
      .from("site_content")
      .select("content")
      .eq("content_key", contentKey)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data?.content) {
          return fallback;
        }
        return data.content as T;
      })
      .catch(() => fallback)
      .then((value) => {
        contentCache.set(contentKey, value);
        writeStoredContent(contentKey, value);
        inFlightRequests.delete(contentKey);
        return value;
      });

    inFlightRequests.set(contentKey, request);
  }

  return (await inFlightRequests.get(contentKey)) as T;
}

export function useSiteContent<T>(contentKey: SiteContentKey, fallback: T): T {
  const [content, setContent] = useState<T>(fallback);

  useEffect(() => {
    let isActive = true;

    void fetchSiteContent(contentKey, fallback).then((value) => {
      if (isActive) {
        setContent(value);
      }
    });

    return () => {
      isActive = false;
    };
  }, [contentKey, fallback]);

  return content;
}

export function clearSiteContentCache(contentKey?: SiteContentKey) {
  if (contentKey) {
    contentCache.delete(contentKey);
    inFlightRequests.delete(contentKey);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${contentKey}`);
    }
    return;
  }

  contentCache.clear();
  inFlightRequests.clear();

  if (typeof window !== "undefined") {
    Object.values([
      "site_links",
      "site_shop_products",
      "site_services",
      "site_faq",
      "site_blog",
      "site_crystal_of_day",
    ] as SiteContentKey[]).forEach((key) => {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    });
  }
}