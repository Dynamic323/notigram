import { useEffect, useRef } from 'react';
import { UAParser } from 'ua-parser-js';

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

export default function Notigram({
  botToken,
  chatId,
  fields = ['ip', 'country', 'flag', 'city', 'device', 'page', 'time'],
  customMessage,
  onSuccess,
  onError,
  disabled = false,
  debounceMs = 0
}: NotigramProps) {
  const hasNotified = useRef(false);

  useEffect(() => {
    if (disabled || hasNotified.current) return;

    const timer = setTimeout(() => {
      collectAndNotify();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, []);

  const collectAndNotify = async () => {
    if (hasNotified.current) return;
    hasNotified.current = true;

    try {
      // Get IP
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipRes.json();

      // Get complete location data
      const locRes = await fetch(`https://ipwho.is/${ip}`);
      const locationData = await locRes.json();

      // Get device info
      const parser = new UAParser();
      const { browser, os, device } = parser.getResult();

      const visitorData: VisitorData = {
        // IP Data
        ip: locationData.ip,
        success: locationData.success,
        type: locationData.type,
        
        // Location Data
        continent: locationData.continent,
        continent_code: locationData.continent_code,
        country: locationData.country,
        country_code: locationData.country_code,
        region: locationData.region,
        region_code: locationData.region_code,
        city: locationData.city,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        is_eu: locationData.is_eu,
        postal: locationData.postal,
        calling_code: locationData.calling_code,
        capital: locationData.capital,
        borders: locationData.borders,
        
        // Flag Data
        flag: locationData.flag,
        
        // Connection Data
        connection: locationData.connection,
        
        // Timezone Data
        timezone: locationData.timezone,
        
        // Device Data
        device: device.vendor && device.model 
          ? `${device.vendor} ${device.model}` 
          : device.type || 'Desktop',
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
        
        // Page Data
        page: window.location.pathname,
        fullUrl: window.location.href,
        referrer: document.referrer || 'Direct',
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent
      };

      // Build message
      const message = customMessage 
        ? customMessage(visitorData)
        : buildDefaultMessage(visitorData, fields);

      // Send to Telegram
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      onSuccess?.(visitorData);
    } catch (err) {
      console.error('Notigram error:', err);
      onError?.(err as Error);
    }
  };

  return null;
}

function buildDefaultMessage(data: VisitorData, fields: string[]): string {
  let message = '🚨 *New Visitor Alert*\n━━━━━━━━━━━━━━━\n';

  const fieldMap: Record<string, string> = {
    page: `🌐 *Page*: ${data.page}`,
    ip: `💻 *IP*: ${data.ip}`,
    country: `🌍 *Country*: ${data.country}`,
    flag: data.flag?.emoji ? `${data.flag.emoji} *Flag*: ${data.country}` : '',
    city: `🏙️ *City*: ${data.city}`,
    region: `📍 *Region*: ${data.region}`,
    continent: `🌎 *Continent*: ${data.continent}`,
    device: `📱 *Device*: ${data.device}`,
    browser: `🌐 *Browser*: ${data.browser}`,
    os: `⚙️ *OS*: ${data.os}`,
    time: `⏰ *Time*: ${data.timestamp}`,
    timezone: `🕐 *Timezone*: ${data.timezone?.id} (${data.timezone?.utc})`,
    isp: `📡 *ISP*: ${data.connection?.isp}`,
    org: `🏢 *Organization*: ${data.connection?.org}`,
    asn: `🔢 *ASN*: ${data.connection?.asn}`,
    coordinates: `📌 *Coordinates*: ${data.latitude}, ${data.longitude}`,
    postal: data.postal ? `📮 *Postal*: ${data.postal}` : '',
    calling_code: `📞 *Calling Code*: +${data.calling_code}`
  };

  fields.forEach(field => {
    const value = fieldMap[field];
    if (value) {
      message += value + '\n';
    }
  });

  message += '━━━━━━━━━━━━━━━\n';
  message += '_Built by [Dycoder](http://dycoder.space/) 💙_';
  
  return message;
}

// Export types
export type { NotigramProps, VisitorData };