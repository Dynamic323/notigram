import { useEffect, useRef } from "react";
import { UAParser } from "ua-parser-js";

interface NotigramProps {
  botToken: string;
  chatId: string;
  fields?: (
    | "ip"
    | "location"
    | "device"
    | "browser"
    | "os"
    | "page"
    | "time"
    | "timezone"
    | "country"
    | "country_code"
    | "city"
    | "region"
    | "region_code"
    | "isp"
    | "continent"
    | "continent_code"
    | "flag"
    | "coordinates"
    | "postal"
    | "calling_code"
    | "asn"
    | "org"
  )[];
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
  fields = ["page", "country", "flag", "city", "device", "time"],
  customMessage,
  onSuccess,
  onError,
  disabled = false,
  debounceMs = 0,
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
      const ipRes = await fetch("https://api.ipify.org?format=json");
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
        device:
          device.vendor && device.model
            ? `${device.vendor} ${device.model}`
            : device.type || "Desktop",
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,

        // Page Data
        page: window.location.pathname,
        fullUrl: window.location.href,
        referrer: document.referrer || "Direct",
        timestamp: new Date().toLocaleString(),
        userAgent: navigator.userAgent,
      };

      // Build message
      const message = customMessage
        ? customMessage(visitorData)
        : buildDefaultMessage(visitorData, fields);

      // Send to Telegram
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      onSuccess?.(visitorData);
    } catch (err) {
      console.error("Notigram error:", err);
      onError?.(err as Error);
    }
  };

  return null;
}

function buildDefaultMessage(data: VisitorData, fields: string[]): string {
  let message = "🚨 <b>New Visitor Alert</b>\n━━━━━━━━━━━━━━━\n";

  const escapeHTML = (text: string | undefined) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const fieldMap: Record<string, string> = {
    page: `🌐 <b>Page:</b> ${escapeHTML(data.page)}`,
    ip: `💻 <b>IP:</b> ${escapeHTML(data.ip)}`,
    country: `🌍 <b>Country:</b> ${escapeHTML(data.country)}`,
    country_code: `🏳️ <b>Country Code:</b> ${escapeHTML(data.country_code)}`,
    flag: data.flag?.emoji
      ? `${data.flag.emoji} <b>Flag:</b> ${escapeHTML(data.country)}`
      : "",
    city: `🏙️ <b>City:</b> ${escapeHTML(data.city)}`,
    region: `📍 <b>Region:</b> ${escapeHTML(data.region)}`,
    region_code: `📌 <b>Region Code:</b> ${escapeHTML(data.region_code)}`,
    continent: `🌎 <b>Continent:</b> ${escapeHTML(data.continent)}`,
    continent_code: `🗺️ <b>Continent Code:</b> ${escapeHTML(data.continent_code)}`,
    device: `📱 <b>Device:</b> ${escapeHTML(data.device)}`,
    browser: `🌐 <b>Browser:</b> ${escapeHTML(data.browser)}`,
    os: `⚙️ <b>OS:</b> ${escapeHTML(data.os)}`,
    time: `⏰ <b>Time:</b> ${escapeHTML(data.timestamp)}`,
    timezone: `🕐 <b>Timezone:</b> ${escapeHTML(data.timezone?.id)} (${escapeHTML(data.timezone?.utc)})`,
    isp: `📡 <b>ISP:</b> ${escapeHTML(data.connection?.isp)}`,
    org: `🏢 <b>Organization:</b> ${escapeHTML(data.connection?.org)}`,
    asn: `🔢 <b>ASN:</b> ${escapeHTML(data.connection?.asn?.toString())}`,
    coordinates: `📌 <b>Coordinates:</b> ${escapeHTML(data.latitude?.toString())}, ${escapeHTML(data.longitude?.toString())}`,
    postal: data.postal ? `📮 <b>Postal:</b> ${escapeHTML(data.postal)}` : "",
    calling_code: `📞 <b>Calling Code:</b> +${escapeHTML(data.calling_code)}`,
    location: `📍 <b>Location:</b> ${escapeHTML(data.city)}, ${escapeHTML(data.region)}, ${escapeHTML(data.country)}`,
  };

  fields.forEach((field) => {
    const value = fieldMap[field];
    if (value) {
      message += value + "\n";
    }
  });

  message += "━━━━━━━━━━━━━━━\n";
  message += "<i>Built with 💙 by Dycoder</i>";

  return message;
}

export type { NotigramProps, VisitorData };
