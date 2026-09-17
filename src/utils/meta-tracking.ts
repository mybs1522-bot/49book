declare global {
    interface Window {
        fbq: any;
    }
}

/**
 * Generates a unique event ID for deduplication between Pixel and CAPI.
 */
const generateEventId = () => {
    return 'event-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
};

export interface MetaEventData {
    eventName: string;
    email?: string;
    value?: number;
    currency?: string;
    content_ids?: string[];
    content_type?: string;
    [key: string]: any;
}

const isBotUserAgent = () => {
    if (typeof window === 'undefined' || !window.navigator) return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /bot|crawler|spider|crawling|facebookexternalhit|whatsapp|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|chrome-lighthouse|ptst/i.test(ua);
};

/**
 * Tracks an event to both Meta Pixel (browser) and Meta Conversion API (server).
 */
export const trackMetaEvent = async (data: MetaEventData) => {
    if (isBotUserAgent()) {
        console.log(`[Meta Tracking] Blocked bot traffic for event: ${data.eventName}`);
        return;
    }

    const { eventName, email, value, currency, content_ids, content_type, order_id, ...customData } = data;
    
    // Use order_id as the eventId if available, otherwise generate a unique one.
    // This perfectly deduplicates page refreshes or 'Back' button navigations!
    const eventId = order_id || generateEventId();

    // 1. Fire Pixel Event (Browser)
    if (typeof window.fbq === 'function') {
        window.fbq('track', eventName, {
            value,
            currency,
            content_ids,
            content_type,
            ...customData
        }, { eventID: eventId });
        console.log(`[Meta Pixel] Tracked: ${eventName}`, { eventId });
    }

    // 2. Fire Conversion API Event (Server via Supabase Edge Function)
    try {
        const res = await fetch('https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/meta-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventName,
                event_id: eventId,
                user_data: {
                    em: email ? email.toLowerCase().trim() : undefined,
                },
                custom_data: {
                    value,
                    currency,
                    content_ids,
                    content_type,
                    ...customData
                }
            })
        });

        if (!res.ok) {
            console.error('[Meta CAPI] Error:', await res.text());
        } else {
            console.log(`[Meta CAPI] Tracked: ${eventName}`, { eventId });
        }
    } catch (err) {
        console.error('[Meta CAPI] Invoke failed:', err);
    }
};
