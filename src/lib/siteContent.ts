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

export async function fetchSiteContent<T>(contentKey: SiteContentKey, fallback: T): Promise<T> {
  if (contentCache.has(contentKey)) {
    return contentCache.get(contentKey) as T;
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
    return;
  }

  contentCache.clear();
  inFlightRequests.clear();
}