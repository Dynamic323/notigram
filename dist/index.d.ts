interface NotigramProps {
    botToken: string;
    chatId: string;
    fields?: ('ip' | 'location' | 'device' | 'browser' | 'os' | 'page' | 'time' | 'timezone' | 'country' | 'city' | 'region' | 'isp' | 'continent' | 'flag' | 'coordinates' | 'postal' | 'calling_code' | 'asn' | 'org')[];
    customMessage?: (data: VisitorData) => string;
    onSuccess?: (data: VisitorData) => void;
    onError?: (error: Error) => void;
    disabled?: boolean;
    debounceMs?: number;
}
interface VisitorData {
    ip?: string;
    success?: boolean;
    type?: string;
    continent?: string;
    continent_code?: string;
    country?: string;
    country_code?: string;
    region?: string;
    region_code?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    is_eu?: boolean;
    postal?: string;
    calling_code?: string;
    capital?: string;
    borders?: string;
    flag?: {
        img?: string;
        emoji?: string;
        emoji_unicode?: string;
    };
    connection?: {
        asn?: number;
        org?: string;
        isp?: string;
        domain?: string;
    };
    timezone?: {
        id?: string;
        abbr?: string;
        is_dst?: boolean;
        offset?: number;
        utc?: string;
        current_time?: string;
    };
    device?: string;
    browser?: string;
    os?: string;
    page?: string;
    fullUrl?: string;
    referrer?: string;
    timestamp?: string;
    userAgent?: string;
}
export default function Notigram({ botToken, chatId, fields, customMessage, onSuccess, onError, disabled, debounceMs }: NotigramProps): null;
export type { NotigramProps, VisitorData };
