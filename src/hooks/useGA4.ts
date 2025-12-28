import { useCallback, useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Hook para tracking GA4 + Google Ads - MamãeZen
 * 
 * Eventos rastreados:
 * - page_view (automático pelo GA4)
 * - cta_inicio_click
 * - checkout_click
 * - purchase (value = 49.90, currency = BRL)
 * 
 * Google Ads Conversions:
 * - Substitua 'AW-XXXXXXXXX/YYYYYYY' pelos seus IDs reais de conversão
 */

// IDs de conversão do Google Ads (substitua pelos seus IDs reais)
const GOOGLE_ADS_CONVERSIONS = {
  cta_inicio_click: 'AW-XXXXXXXXX/cta_inicio', // Substitua pelo ID real
  checkout_click: 'AW-XXXXXXXXX/checkout',     // Substitua pelo ID real
  purchase: 'AW-XXXXXXXXX/purchase'            // Substitua pelo ID real
};

export const useGA4 = () => {
  const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
      console.log(`📊 [GA4] ${eventName}`, params);
    }
  }, []);

  const trackConversion = useCallback((conversionId: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag && !conversionId.includes('XXXXXXXXX')) {
      window.gtag('event', 'conversion', {
        send_to: conversionId,
        ...params
      });
      console.log(`📊 [Google Ads] Conversion: ${conversionId}`, params);
    }
  }, []);

  // Clique no CTA inicial (botão de play do vídeo)
  const trackCtaInicioClick = useCallback(() => {
    trackEvent('cta_inicio_click');
    trackConversion(GOOGLE_ADS_CONVERSIONS.cta_inicio_click);
  }, [trackEvent, trackConversion]);

  // Clique no botão de checkout
  const trackCheckoutClick = useCallback(() => {
    trackEvent('checkout_click');
    trackConversion(GOOGLE_ADS_CONVERSIONS.checkout_click);
  }, [trackEvent, trackConversion]);

  // Compra via Cakto
  const trackPurchase = useCallback(() => {
    trackEvent('purchase', {
      value: 49.90,
      currency: 'BRL'
    });
    trackConversion(GOOGLE_ADS_CONVERSIONS.purchase, {
      value: 49.90,
      currency: 'BRL'
    });
  }, [trackEvent, trackConversion]);

  return {
    trackEvent,
    trackCtaInicioClick,
    trackCheckoutClick,
    trackPurchase
  };
};

/**
 * Hook para detectar retorno do checkout Cakto e disparar purchase automaticamente
 * 
 * Uso: Adicione ?purchase=success ou ?cakto_success=true na URL de retorno do Cakto
 * Também suporta postMessage do iframe do Cakto
 */
export const useCaktoPurchaseDetection = (onPurchase: () => void) => {
  useEffect(() => {
    // Detecta purchase via URL params
    const urlParams = new URLSearchParams(window.location.search);
    const purchaseSuccess = 
      urlParams.get('purchase') === 'success' ||
      urlParams.get('cakto_success') === 'true' ||
      urlParams.get('status') === 'approved' ||
      urlParams.get('payment_status') === 'approved';

    if (purchaseSuccess) {
      console.log('🎉 [Cakto] Purchase detected via URL params');
      onPurchase();
      
      // Remove os params da URL para evitar disparo duplicado
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    // Detecta purchase via postMessage (para iframes do Cakto)
    const handleMessage = (event: MessageEvent) => {
      // Aceita mensagens de domínios do Cakto
      if (event.origin.includes('cakto') || event.origin.includes('checkout')) {
        const data = event.data;
        
        if (
          data?.type === 'purchase' ||
          data?.status === 'approved' ||
          data?.event === 'purchase_complete'
        ) {
          console.log('🎉 [Cakto] Purchase detected via postMessage', data);
          onPurchase();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onPurchase]);
};
