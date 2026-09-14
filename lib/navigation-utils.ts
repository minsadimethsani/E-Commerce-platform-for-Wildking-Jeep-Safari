/**
 * Navigation Flow Utilities
 * Wildking Safari - Sri Lanka Expeditions
 */

/**
 * Navigates back in browser history if the user arrived from the same website,
 * otherwise falls back gracefully to a specified fallback URL.
 */
export function goBackWithFallback(router: any, fallbackPath: string = "/") {
  if (typeof window !== "undefined") {
    const hasHistory = window.history.length > 1;
    const sameOriginReferrer =
      document.referrer && document.referrer.includes(window.location.host);

    if (hasHistory && sameOriginReferrer) {
      router.back();
      return;
    }
  }

  if (router && typeof router.push === "function") {
    router.push(fallbackPath);
  } else if (typeof window !== "undefined") {
    window.location.href = fallbackPath;
  }
}
