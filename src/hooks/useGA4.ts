import { useCallback } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Hook simplificado para tracking GA4 - MamãeZen
 * Eventos rastreados:
 * - page_view (automático pelo GA4)
 * - cta_inicio_click
 * - checkout_click
 * - purchase
 */
export const useGA4 = () => {
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
      console.log(`📊 [GA4] ${eventName}`, params);
    }
  }, []);

  // Clique no CTA inicial (botão de play do vídeo)
  const trackCtaInicioClick = useCallback(() => {
    trackEvent('cta_inicio_click');
  }, [trackEvent]);

  // Clique no botão de checkout
  const trackCheckoutClick = useCallback(() => {
    trackEvent('checkout_click');
  }, [trackEvent]);

  // Compra via Cakto (pode ser chamado via URL params ou postMessage)
  const trackPurchase = useCallback(() => {
    trackEvent('purchase', {
      value: 49.90,
      currency: 'BRL'
    });
  }, [trackEvent]);

  return {
    trackCtaInicioClick,
    trackCheckoutClick,
    trackPurchase
  };
};
