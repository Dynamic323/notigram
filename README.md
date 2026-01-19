# Notigram

Real-time Telegram notifications for your React and Next.js applications. Get instant alerts whenever someone visits your website, complete with comprehensive visitor analytics including IP address, location, device information, ISP details, and more.

Built by [Dycoder](http://dycoder.space/) 💙

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Telegram Bot Setup](#telegram-bot-setup)
  - [Creating Your Bot](#1-creating-your-telegram-bot)
  - [Getting Your Chat ID](#2-getting-your-chat-id)
  <!-- - [Video Tutorial](#video-tutorial) -->
- [Usage](#usage)
  - [Basic Implementation](#basic-implementation)
  - [Next.js App Router](#nextjs-app-router)
  - [Next.js Pages Router](#nextjs-pages-router)
  - [React (Vite, CRA)](#react-vite-cra)
- [Configuration](#configuration)
  - [Available Fields](#available-fields)
  - [Custom Messages](#custom-messages)
  - [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Structure](#data-structure)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Privacy & Security](#privacy)
---

## Features

- **Zero Configuration Required** - Drop it in and start receiving notifications
- **Comprehensive Visitor Data** - IP, location, device, browser, ISP, timezone, and more
- **Fully Customizable** - Choose which fields to display or create custom message formats
- **TypeScript Support** - Full type definitions included
- **Framework Agnostic** - Works with Next.js (App Router & Pages Router), React, and any React-based framework
- **Privacy Focused** - All data is sent directly to your Telegram bot, no third-party tracking
- **Lightweight** - Minimal bundle size impact
- **No Backend Required** - Pure client-side implementation

---

## Installation

```bash
npm install notigram
```

```bash
yarn add notigram
```

```bash
pnpm add notigram
```

---

## Quick Start

```jsx
import Notigram from 'notigram';

function App() {
  return (
    <>
      <Notigram 
        botToken="YOUR_BOT_TOKEN"
        chatId="YOUR_CHAT_ID"
      />
      {/* Your app content */}
    </>
  );
}
```

---

## Telegram Bot Setup

### 1. Creating Your Telegram Bot

**Step 1:** Open Telegram and search for `@BotFather`

**Step 2:** Start a conversation with BotFather by clicking "Start" or sending `/start`

**Step 3:** Create a new bot by sending the command:
```
/newbot
```

**Step 4:** Follow the prompts:
- Choose a name for your bot (e.g., "My Website Notifier")
- Choose a username for your bot (must end in 'bot', e.g., "mywebsite_notifier_bot")

**Step 5:** BotFather will provide you with your bot token. It looks like this:
```
123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**Important:** Keep this token secure. Anyone with this token can control your bot.

### 2. Getting Your Chat ID

**Method 1: Using a Bot (Recommended)**

**Step 1:** Search for `@userinfobot` in Telegram

**Step 2:** Start a conversation and it will immediately send you your chat ID

**Step 3:** Copy the number (it usually starts with a negative sign for groups or is positive for personal chats)

**Method 2: Manual Method**

**Step 1:** Send a message to your bot (the one you created with BotFather)

**Step 2:** Open this URL in your browser (replace YOUR_BOT_TOKEN with your actual token):
```
https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```

**Step 3:** Look for the `"chat":{"id":` field in the JSON response. The number after `id` is your chat ID.

<!-- ### Video Tutorial

For a complete video walkthrough of the setup process, watch this tutorial:

**[Video: How to Set Up Notigram]** _(Upload your video and add the link here)_ -->

---

## Usage

### Basic Implementation

```jsx
import Notigram from 'notigram';

export default function App() {
  return (
    <>
      <Notigram 
        botToken="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
        chatId="123456789"
      />
      {/* Rest of your app */}
    </>
  );
}
```

### Next.js App Router

Place the component in your root layout to track all page visits:

```jsx
// app/layout.js or app/layout.tsx
import Notigram from 'notigram';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Notigram 
          botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
          chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
        />
        {children}
      </body>
    </html>
  );
}
```

### Next.js Pages Router

Add it to your `_app.js` file:

```jsx
// pages/_app.js or pages/_app.tsx
import Notigram from 'notigram';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Notigram 
        botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
        chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
      />
      <Component {...pageProps} />
    </>
  );
}
```

### React (Vite, CRA)

Add it to your main App component:

```jsx
// src/App.jsx or src/App.tsx
import Notigram from 'notigram';

function App() {
  return (
    <>
      <Notigram 
        botToken={import.meta.env.VITE_TELEGRAM_BOT_TOKEN}
        chatId={import.meta.env.VITE_TELEGRAM_CHAT_ID}
      />
      {/* Your app components */}
    </>
  );
}

export default App;
```

---

## Configuration

### Available Fields

Choose which data points to include in your notifications:

```jsx
<Notigram 
  botToken="YOUR_BOT_TOKEN"
  chatId="YOUR_CHAT_ID"
  fields={['ip', 'country', 'flag', 'city', 'isp', 'device', 'time']}
/>
```

**Complete list of available fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `ip` | Visitor's IP address | `102.89.82.30` |
| `country` | Country name | `Nigeria` |
| `country_code` | ISO country code | `NG` |
| `flag` | Country flag emoji | `🇳🇬` |
| `city` | City name | `Lagos` |
| `region` | State/Region | `Lagos State` |
| `region_code` | Region code | `LA` |
| `continent` | Continent name | `Africa` |
| `continent_code` | Continent code | `AF` |
| `timezone` | Full timezone info | `Africa/Lagos (UTC+01:00)` |
| `coordinates` | Latitude & Longitude | `6.4541, 3.3947` |
| `postal` | Postal/ZIP code | `100001` |
| `calling_code` | Country calling code | `+234` |
| `isp` | Internet Service Provider | `MTN Nigeria` |
| `org` | Organization name | `MTN Nigeria Communication` |
| `asn` | Autonomous System Number | `29465` |
| `device` | Device type/model | `iPhone 13 Pro` |
| `browser` | Browser name & version | `Chrome 120.0` |
| `os` | Operating system | `iOS 17.2` |
| `page` | Current page path | `/about` |
| `time` | Visit timestamp | `1/14/2026, 2:30:45 PM` |

### Custom Messages

Create fully customized notification messages:

```jsx
<Notigram 
  botToken="YOUR_BOT_TOKEN"
  chatId="YOUR_CHAT_ID"
  customMessage={(data) => {
    return `
🌍 New visitor from ${data.flag?.emoji} ${data.country}

📍 Location: ${data.city}, ${data.region}
📱 Device: ${data.device}
🌐 Browser: ${data.browser}
💻 IP: ${data.ip}
🏢 ISP: ${data.connection?.isp}
📄 Page: ${data.page}
⏰ Time: ${data.timestamp}

Built by Dycoder 💙
    `.trim();
  }}
/>
```

**Access the complete data object:**

```jsx
customMessage={(data) => {
  // data contains all visitor information
  console.log(data);
  
  return `Custom notification for ${data.city}`;
}}
```

### Environment Variables

**Recommended approach for security:**

Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
NEXT_PUBLIC_TELEGRAM_CHAT_ID=123456789
```

For Vite projects:

```bash
# .env
VITE_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
VITE_TELEGRAM_CHAT_ID=123456789
```

**Usage:**

```jsx
// Next.js
<Notigram 
  botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
  chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
/>

// Vite
<Notigram 
  botToken={import.meta.env.VITE_TELEGRAM_BOT_TOKEN}
  chatId={import.meta.env.VITE_TELEGRAM_CHAT_ID}
/>
```

**Important:** Add `.env.local` to your `.gitignore` file to prevent committing sensitive data.

---

## API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `botToken` | `string` | Yes | - | Your Telegram bot token from BotFather |
| `chatId` | `string` | Yes | - | Your Telegram chat ID |
| `fields` | `array` | No | All fields | Array of field names to include in notifications |
| `customMessage` | `function` | No | - | Function that receives visitor data and returns a custom message string |
| `onSuccess` | `function` | No | - | Callback function called after successful notification. Receives visitor data. |
| `onError` | `function` | No | - | Callback function called on error. Receives error object. |
| `disabled` | `boolean` | No | `false` | Disable notifications without removing the component |
| `debounceMs` | `number` | No | `0` | Delay in milliseconds before sending notification |

### Callback Examples

```jsx
<Notigram 
  botToken="YOUR_BOT_TOKEN"
  chatId="YOUR_CHAT_ID"
  onSuccess={(data) => {
    console.log('Notification sent successfully');
    console.log('Visitor from:', data.city);
    // Track in your analytics
    analytics.track('visitor_notification_sent', {
      country: data.country,
      device: data.device
    });
  }}
  onError={(error) => {
    console.error('Failed to send notification:', error);
    // Log to your error tracking service
    errorTracker.captureException(error);
  }}
/>
```

---

## Data Structure

The complete visitor data object structure:

```typescript
interface VisitorData {
  // IP Information
  ip?: string;
  success?: boolean;
  type?: string; // "IPv4" or "IPv6"
  
  // Location
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
  
  // Flag
  flag?: {
    img?: string;
    emoji?: string;
    emoji_unicode?: string;
  };
  
  // Connection
  connection?: {
    asn?: number;
    org?: string;
    isp?: string;
    domain?: string;
  };
  
  // Timezone
  timezone?: {
    id?: string;
    abbr?: string;
    is_dst?: boolean;
    offset?: number;
    utc?: string;
    current_time?: string;
  };
  
  // Device Information
  device?: string;
  browser?: string;
  os?: string;
  
  // Page Information
  page?: string;
  fullUrl?: string;
  referrer?: string;
  timestamp?: string;
  userAgent?: string;
}
```

---

## Examples

### Example 1: Minimal Setup

```jsx
import Notigram from 'notigram';

function App() {
  return (
    <>
      <Notigram 
        botToken="123456789:ABC..."
        chatId="123456789"
      />
      <YourApp />
    </>
  );
}
```

### Example 2: Essential Fields Only

```jsx
<Notigram 
  botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
  chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
  fields={['country', 'city', 'device', 'page', 'time']}
/>
```

### Example 3: With Analytics Integration

```jsx
<Notigram 
  botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
  chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
  onSuccess={(data) => {
    // Send to your analytics
    window.gtag('event', 'page_view', {
      country: data.country,
      device: data.device
    });
  }}
/>
```

### Example 4: Conditional Notifications

```jsx
<Notigram 
  botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
  chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
  // Only enable in production
  disabled={process.env.NODE_ENV !== 'production'}
/>
```

### Example 5: Custom Branded Message

```jsx
<Notigram 
  botToken={process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}
  chatId={process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID}
  customMessage={(data) => `
━━━━━━━━━━━━━━━
🌟 ACME Corp Visitor Alert

${data.flag?.emoji} Visitor from ${data.city}, ${data.country}

Device: ${data.device}
Browser: ${data.browser}
Page: ${data.page}
Time: ${data.timestamp}

ISP: ${data.connection?.isp}
IP: ${data.ip}
━━━━━━━━━━━━━━━
Built by Dycoder 💙
  `}
/>
```

---

## Troubleshooting

### Not Receiving Notifications

**1. Verify your bot token**
- Make sure you copied the complete token from BotFather
- Check for any extra spaces or characters

**2. Verify your chat ID**
- Send a message to your bot first
- Use the manual method described above to confirm your chat ID

**3. Check if the component is mounted**
- Make sure Notigram is placed in a component that renders on page load
- Check browser console for any errors

**4. CORS Issues**
- The Telegram API should work from any domain
- If you see CORS errors, check your browser console

### Component Not Working in Development

**1. Environment variables**
- Restart your development server after adding `.env.local`
- For Next.js, variables must start with `NEXT_PUBLIC_`
- For Vite, variables must start with `VITE_`

**2. Check the browser console**
- Look for any error messages
- Verify the component is actually running

### TypeScript Errors

If you're getting TypeScript errors:

```bash
npm install --save-dev @types/react
```

### Rate Limiting

If you're testing and sending too many notifications:

```jsx
<Notigram 
  botToken="YOUR_BOT_TOKEN"
  chatId="YOUR_CHAT_ID"
  debounceMs={5000} // Wait 5 seconds before sending
/>
```

---

## Best Practices

1. **Use Environment Variables** - Never commit your bot token to version control

2. **Disable in Development** - Avoid spam notifications during development:
```jsx
disabled={process.env.NODE_ENV === 'development'}
```

3. **Select Relevant Fields** - Only include data you actually need

4. **Handle Errors** - Implement error callbacks for production monitoring

5. **Test First** - Send a test message to your bot before deploying

---

## Privacy & Security

- All visitor data is sent directly to your Telegram bot
- No data is stored on any third-party servers
- The package only uses public IP geolocation APIs
- Bot tokens should be kept secure and never exposed in client-side code (they're required client-side for this use case, so use environment variables)

---

## Contributing

Found a bug or have a feature request? Open an issue on GitHub.

---

## License

MIT License - feel free to use in personal and commercial projects.

---

## Privacy

- All visitor data is sent directly to your Telegram bot
- No data is stored on any third-party servers
- The package only uses public IP geolocation APIs
- **Important**: Your bot token will be visible in client-side code. This is 
  inherent to how the package works. Each user creates their own bot and uses 
  their own credentials - no shared tokens. Keep your `.env.local` file in 
  `.gitignore` to avoid committing your tokens to version control.

---

## Credits

Built with dedication by [Dycoder](http://dycoder.space/) 💙

If you find this package useful, consider:
- Giving it a star on GitHub
- Sharing it with other developers
- Checking out my other projects at [dycoder.space](http://dycoder.space/)

---

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check existing issues for solutions
- Read through the troubleshooting section above

---

**Happy tracking! 🚀**
