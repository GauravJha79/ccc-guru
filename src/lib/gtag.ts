export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-VL371334SD';

// Log custom events to Google Analytics
export const trackEvent = (
  action: string,
  params?: Record<string, string | number | boolean | undefined | null>
) => {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', action, params);
  }
};
