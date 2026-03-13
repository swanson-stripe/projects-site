import { useState, useCallback, useRef, useEffect, forwardRef, useImperativeHandle, type PointerEvent as RPE } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { InView } from '@/components/ui/in-view';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useTheme } from '@/components/ui/ThemeContext';

export type Category = 'payments' | 'auth' | 'database' | 'storage' | 'monitoring' | 'analytics' | 'ai' | 'hosting';

export const CATEGORIES: Category[] = ['ai', 'analytics', 'auth', 'database', 'hosting', 'monitoring', 'payments', 'storage'];

export interface Partner {
  name:            string;
  category:        Category;
  url:             string;
  logo:            React.FC<{ className?: string }>;
  description:     string;
  longDescription: string;
  cliCommand:      string;
  /** logo is white on transparent — needs invert on light themes */
  lightInvert?:    boolean;
  /** logo uses a brand colour that should become white on dark themes */
  darkWhite?:      boolean;
  /** suppress from icon grids while keeping data intact */
  hidden?:         boolean;
}

/* ── Logos — official marks, no background boxes ─────────────────────────── */

// Stripe: inlined from /public/stripe-logo.svg with brand fill
const StripeLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M0 16L16 12.6069V0L0 3.43278V16Z" fill="#533AFD" />
  </svg>
);

// Clerk — official symbol mark, primary colours
const ClerkLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 128 128' fill='none'>
    <path d='M99.5716 10.788C101.571 12.1272 101.742 14.9444 100.04 16.646L85.4244 31.2618C84.1035 32.5828 82.0542 32.7914 80.3915 31.9397C75.4752 29.421 69.9035 28 64 28C44.1177 28 28 44.1177 28 64C28 69.9035 29.421 75.4752 31.9397 80.3915C32.7914 82.0542 32.5828 84.1035 31.2618 85.4244L16.646 100.04C14.9444 101.742 12.1272 101.571 10.788 99.5716C3.97411 89.3989 0 77.1635 0 64C0 28.6538 28.6538 0 64 0C77.1635 0 89.3989 3.97411 99.5716 10.788Z' fill='#BAB1FF'/>
    <path d='M84 64C84 75.0457 75.0457 84 64 84C52.9543 84 44 75.0457 44 64C44 52.9543 52.9543 44 64 44C75.0457 44 84 52.9543 84 64Z' fill='#6C47FF'/>
    <path d='M100.04 111.354C101.742 113.056 101.571 115.873 99.5717 117.212C89.3989 124.026 77.1636 128 64 128C50.8364 128 38.6011 124.026 28.4283 117.212C26.4289 115.873 26.2581 113.056 27.9597 111.354L42.5755 96.7382C43.8965 95.4172 45.9457 95.2085 47.6084 96.0603C52.5248 98.579 58.0964 100 64 100C69.9036 100 75.4753 98.579 80.3916 96.0603C82.0543 95.2085 84.1036 95.4172 85.4245 96.7382L100.04 111.354Z' fill='#6C47FF'/>
  </svg>
);

// Supabase — Simple Icons, brand gradient
const SupabaseLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='none'>
    <path fill='url(#sb-g2)' d='M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z'/>
    <defs>
      <linearGradient id='sb-g2' x1='1' y1='1' x2='22' y2='22' gradientUnits='userSpaceOnUse'>
        <stop stopColor='#249361'/>
        <stop offset='1' stopColor='#3ECF8E'/>
      </linearGradient>
    </defs>
  </svg>
);

// PostHog — official logomark from posthog.com/brand (light-theme friendly)
const PostHogLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 50 30' fill='none'>
    <path d='M10.8914 17.2057c-.3685.7371-1.42031.7371-1.78884 0L8.2212 15.443c-.14077-.2815-.14077-.6129 0-.8944l.88136-1.7627c.36853-.7371 1.42034-.7371 1.78884 0l.8814 1.7627c.1407.2815.1407.6129 0 .8944l-.8814 1.7627zM10.8914 27.2028c-.3685.737-1.42031.737-1.78884 0L8.2212 25.44c-.14077-.2815-.14077-.6129 0-.8944l.88136-1.7627c.36853-.7371 1.42034-.7371 1.78884 0l.8814 1.7627c.1407.2815.1407.6129 0 .8944l-.8814 1.7628z' fill='#1D4AFF'/>
    <path d='M0 23.4082c0-.8909 1.07714-1.3371 1.70711-.7071l4.58338 4.5834c.62997.63.1838 1.7071-.7071 1.7071H.999999c-.552284 0-.999999-.4477-.999999-1v-4.5834zm0-4.8278c0 .2652.105357.5196.292893.7071l9.411217 9.4112c.18753.1875.44189.2929.70709.2929h5.1692c.8909 0 1.3371-1.0771.7071-1.7071L1.70711 12.7041C1.07714 12.0741 0 12.5203 0 13.4112v5.1692zm0-9.99701c0 .26521.105357.51957.292893.7071L19.7011 28.6987c.1875.1875.4419.2929.7071.2929h5.1692c.8909 0 1.3371-1.0771.7071-1.7071L1.70711 2.70711C1.07715 2.07715 0 2.52331 0 3.41421v5.16918zm9.997 0c0 .26521.1054.51957.2929.7071l17.994 17.99401c.63.63 1.7071.1838 1.7071-.7071v-5.1692c0-.2652-.1054-.5196-.2929-.7071l-17.994-17.994c-.63-.62996-1.7071-.18379-1.7071.70711v5.16918zm11.7041-5.87628c-.63-.62997-1.7071-.1838-1.7071.7071v5.16918c0 .26521.1054.51957.2929.7071l7.997 7.99701c.63.63 1.7071.1838 1.7071-.7071v-5.1692c0-.2652-.1054-.5196-.2929-.7071l-7.997-7.99699z' fill='#F9BD2B'/>
    <path d='M42.5248 23.5308l-9.4127-9.4127c-.63-.63-1.7071-.1838-1.7071.7071v13.1664c0 .5523.4477 1 1 1h14.5806c.5523 0 1-.4477 1-1v-1.199c0-.5523-.4496-.9934-.9973-1.0647-1.6807-.2188-3.2528-.9864-4.4635-2.1971zm-6.3213 2.2618c-.8829 0-1.5995-.7166-1.5995-1.5996 0-.8829.7166-1.5995 1.5995-1.5995.883 0 1.5996.7166 1.5996 1.5995 0 .883-.7166 1.5996-1.5996 1.5996z' fill='#000'/>
    <path d='M0 27.9916c0 .5523.447715 1 1 1h4.58339c.8909 0 1.33707-1.0771.70711-1.7071l-4.58339-4.5834C1.07714 22.0711 0 22.5173 0 23.4082v4.5834zM9.997 10.997L1.70711 2.70711C1.07714 2.07714 0 2.52331 0 3.41421v5.16918c0 .26521.105357.51957.292893.7071L9.997 18.9946V10.997zM1.70711 12.7041C1.07714 12.0741 0 12.5203 0 13.4112v5.1692c0 .2652.105357.5196.292893.7071L9.997 28.9916V20.994l-8.28989-8.2899z' fill='#1D4AFF'/>
    <path d='M19.994 11.4112c0-.2652-.1053-.5196-.2929-.7071l-7.997-7.99699c-.6299-.62997-1.70709-.1838-1.70709.7071v5.16918c0 .26521.10539.51957.29289.7071l9.7041 9.70411v-7.5834zM9.99701 28.9916h5.58339c.8909 0 1.3371-1.0771.7071-1.7071L9.99701 20.994v7.9976zM9.99701 10.997v7.5834c0 .2652.10539.5196.29289.7071l9.7041 9.7041v-7.5834c0-.2652-.1053-.5196-.2929-.7071L9.99701 10.997z' fill='#F54E00'/>
  </svg>
);

// Neon — official N mark from neon.tech brand SVG, brand colour #34D59A
const NeonLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 27.542 28' fill='none'>
    <path fill='#34D59A' fillRule='evenodd' d='M27.542.008V28l-10.747-9.508v9.323H0V0zM3.376 24.439H13.42V11.084l10.747 9.508V3.382l-20.79-.005z'/>
  </svg>
);

// Sentry — white fill for dark backgrounds
const SentryLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='M13.91 2.505c-.873-1.448-2.972-1.448-3.844 0L6.904 7.92a15.478 15.478 0 0 1 8.53 12.811h-2.221A13.301 13.301 0 0 0 5.784 9.814l-2.926 5.06a7.65 7.65 0 0 1 4.435 5.848H2.194a.365.365 0 0 1-.298-.534l1.413-2.402a5.16 5.16 0 0 0-1.614-.913L.296 19.275a2.182 2.182 0 0 0 .812 2.999 2.24 2.24 0 0 0 1.086.288h6.983a9.322 9.322 0 0 0-3.845-8.318l1.11-1.922a11.47 11.47 0 0 1 4.95 10.24h5.915a17.242 17.242 0 0 0-7.885-15.28l2.244-3.845a.37.37 0 0 1 .504-.13c.255.14 9.75 16.708 9.928 16.9a.365.365 0 0 1-.327.543h-2.287c.029.612.029 1.223 0 1.831h2.297a2.206 2.206 0 0 0 1.922-3.31z'/>
  </svg>
);

// Chroma — official two-circle mark from trychroma.com, no background
const ChromaLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 2 52.5 36' fill='none'>
    <path d='M17.503 2.501c-9.665 0-17.5 7.835-17.5 17.5s7.835 17.5 17.5 17.5 17.5-7.835 17.5-17.5-7.835-17.5-17.5-17.5z' fill='#327EFF'/>
    <path d='M35.003 2.501c-9.665 0-17.5 7.835-17.5 17.5s7.835 17.5 17.5 17.5 17.5-7.834 17.5-17.5c0-9.665-7.835-17.5-17.5-17.5z' fill='#FFDE2D'/>
    <path d='M17.503 20.002c0-9.665 7.835-17.5 17.5-17.5v17.5h-17.5z' fill='#FF6446'/>
    <path d='M35.003 20.001c0 9.665-7.835 17.5-17.5 17.5v-17.5h17.5z' fill='#FF6446'/>
  </svg>
);

// PlanetScale — Simple Icons, white (brand is black, inverted for dark bg)
const PlanetScaleLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='M0 12C0 5.373 5.373 0 12 0c4.873 0 9.067 2.904 10.947 7.077l-15.87 15.87a11.981 11.981 0 0 1-1.935-1.099L14.99 12H12l-8.485 8.485A11.962 11.962 0 0 1 0 12Zm12.004 12L24 12.004C23.998 18.628 18.628 23.998 12.004 24Z'/>
  </svg>
);

// Railway — Simple Icons, white (brand is black, inverted for dark bg)
const RailwayLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='M.113 10.27A13.026 13.026 0 000 11.48h18.23c-.064-.125-.15-.237-.235-.347-3.117-4.027-4.793-3.677-7.19-3.78-.8-.034-1.34-.048-4.524-.048-1.704 0-3.555.005-5.358.01-.234.63-.459 1.24-.567 1.737h9.342v1.216H.113v.002zm18.26 2.426H.009c.02.326.05.645.094.961h16.955c.754 0 1.179-.429 1.315-.96zm-17.318 4.28s2.81 6.902 10.93 7.024c4.855 0 9.027-2.883 10.92-7.024H1.056zM11.988 0C7.5 0 3.593 2.466 1.531 6.108l4.75-.005v-.002c3.71 0 3.849.016 4.573.047l.448.016c1.563.052 3.485.22 4.996 1.364.82.621 2.007 1.99 2.712 2.965.654.902.842 1.94.396 2.934-.408.914-1.289 1.458-2.353 1.458H.391s.099.42.249.886h22.748A12.026 12.026 0 0024 12.005C24 5.377 18.621 0 11.988 0z'/>
  </svg>
);

// Vercel — Simple Icons, white (brand is black, inverted for dark bg)
const VercelLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='white'>
    <path d='m12 1.608 12 20.784H0Z'/>
  </svg>
);

// Turso — official illustrated mark
const TursoLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 200 170' fill='none'>
    <path d='M100 170C97.8101 170 81.8001 157.2 78.7001 153.55C76.2601 157.28 72.2601 161.51 72.2601 161.51C61.2101 155.94 47.0901 141.45 44.4301 136.38C41.8101 131.38 32.3001 73.7998 32.0401 57.0798C31.7001 47.6698 37.8901 28.5898 100 28.5898C162.11 28.5898 168.29 47.6698 167.96 57.0798C167.71 73.7998 158.2 131.38 155.57 136.38C152.91 141.45 138.79 155.94 127.74 161.51C127.74 161.51 123.74 157.28 121.3 153.55C118.2 157.2 102.19 170 100 170Z' fill='#1EBCA1'/>
    <path d='M100 132.92C79.27 132.92 66.04 121.97 66.04 121.97L67.95 95.3005L46.2 93.3605L42.29 61.8105H157.72L153.81 93.3605L132.06 95.3005L133.97 121.97C133.97 121.97 120.74 132.92 100.01 132.92H100Z' fill='#183134'/>
    <path d='M121.48 75.79L200 48.61C195.33 20.67 170.84 0 170.84 0V30.78L156.3 34.53L147.19 23.56L139.39 38.9L100.01 49.06L60.63 38.9L52.83 23.56L43.72 34.53L29.18 30.78V0C29.18 0 4.67 20.67 0 48.61L78.52 75.79L75.72 113.18C82.42 114.88 89.47 116.57 100 116.57C110.53 116.57 117.57 114.88 124.27 113.18L121.47 75.79H121.48Z' fill='#4FF8D2'/>
  </svg>
);

// Database slot — static placeholder used only during the shuffle animation
const DatabasePlaceholderLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="22" y="16" width="2" height="4" fill="currentColor"/>
    <rect x="22" y="10" width="2" height="4" fill="currentColor"/>
    <rect x="22" y="4"  width="2" height="4" fill="currentColor"/>
    <rect y="16" width="2" height="4" fill="currentColor"/>
    <rect y="10" width="2" height="4" fill="currentColor"/>
    <rect y="4"  width="2" height="4" fill="currentColor"/>
    <rect y="20" width="24" height="2" fill="currentColor"/>
    <rect x="2" y="14" width="20" height="2" fill="currentColor"/>
    <rect x="2" y="8"  width="20" height="2" fill="currentColor"/>
    <rect x="2" y="2"  width="20" height="2" fill="currentColor"/>
  </svg>
);

// ── Coming-soon category icons — currentColor, themed via CSS variables ──

const DatabaseMoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="12" height="4" stroke="currentColor"/>
    <path d="M6 5C6 4.44772 6.44772 4 7 4H17C17.5523 4 18 4.44772 18 5V8H6V5Z" stroke="currentColor"/>
    <rect x="6" y="12" width="12" height="4" stroke="currentColor"/>
    <path d="M6 16.3636C6 16.1628 6.16281 16 6.36364 16H17.6364C17.8372 16 18 16.1628 18 16.3636V16.3636C18 18.3719 16.3719 20 14.3636 20H9.63636C7.62806 20 6 18.3719 6 16.3636V16.3636Z" stroke="currentColor"/>
  </svg>
);

const HostingMoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="10" width="4" height="4" rx="2" fill="currentColor"/>
    <rect x="9" y="10" width="4" height="4" rx="2" fill="currentColor"/>
    <rect x="1" y="8" width="22" height="8" rx="1" stroke="currentColor"/>
  </svg>
);

const AIMoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.51465 12C10 12 11.9999 10 11.9999 3.51472C11.9999 10 14 12 20.4852 12C14 12 11.9999 14 11.9999 20.4853C11.9999 14 10 12 3.51465 12Z" stroke="currentColor" strokeLinejoin="round"/>
  </svg>
);

const AnalyticsMoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="1" stroke="currentColor"/>
    <rect x="5.5" y="13" width="1" height="3" rx="0.5" fill="currentColor"/>
    <rect x="9.5" y="10" width="1" height="6" rx="0.5" fill="currentColor"/>
    <rect x="13.5" y="11" width="1" height="5" rx="0.5" fill="currentColor"/>
    <rect x="17" y="8" width="1" height="8" rx="0.5" fill="currentColor"/>
  </svg>
);

const AuthMoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="9" width="14" height="12" rx="1" stroke="currentColor"/>
    <path d="M8 7C8 4.79086 9.79086 3 12 3V3C14.2091 3 16 4.79086 16 7V9H8V7Z" stroke="currentColor"/>
    <rect x="11.5" y="13" width="1" height="4" rx="0.5" fill="currentColor"/>
  </svg>
);

export type RotatingProvider = { name: string; icon: React.FC<{ className?: string }> };

export const ROTATING_MORE_PROVIDERS: RotatingProvider[] = [
  { name: 'database',  icon: DatabaseMoreIcon  },
  { name: 'hosting',   icon: HostingMoreIcon   },
  { name: 'AI',        icon: AIMoreIcon        },
  { name: 'analytics', icon: AnalyticsMoreIcon },
  { name: 'auth',      icon: AuthMoreIcon      },
];

// Runloop — official mark, white fill for dark backgrounds
const RunloopLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox='0 0 27 21' fill='none'>
    <path d='M21.6932 17.9209C20.5745 19.1792 19.18 20.1847 17.6085 20.8375H24.6956L26.8291 17.9209H21.6932Z' fill='white'/>
    <path d='M13.4145 0C7.72714 0 3.11687 4.66442 3.11687 10.4186C3.11687 12.9561 4.01707 15.2778 5.51047 17.0888H10.0271C7.63869 15.8411 6.0048 13.3247 6.0048 10.4186C6.0048 6.28064 9.32981 2.91658 13.4197 2.91658C17.5097 2.91658 20.8347 6.28064 20.8347 10.4186C20.8347 14.5566 17.5097 17.9206 13.4197 17.9206H2.13342L0 20.8372H13.4145C19.1019 20.8372 23.7122 16.1728 23.7122 10.4186C23.7122 4.66442 19.1019 0 13.4145 0Z' fill='white'/>
  </svg>
);

/* ── Data ────────────────────────────────────────────────────────────────── */

export const PARTNERS: Partner[] = [
  {
    name: 'PlanetScale', category: 'database', url: 'https://planetscale.com', logo: PlanetScaleLogo, lightInvert: true,
    description: 'Serverless MySQL platform',
    longDescription: 'PlanetScale is a fully managed database platform for Postgres and Vitess/MySQL, delivering NVMe-backed performance, massive scale through horizontal sharding, developer-friendly features, and enterprise-grade reliability.',
    cliCommand: 'projects service add planetscale',
  },
  {
    name: 'Supabase', category: 'storage', url: 'https://supabase.com', logo: SupabaseLogo,
    description: 'Open source Firebase alt.',
    longDescription: 'Supabase is the easy-to-use, open-source managed Postgres with integrated backend services. It is an all-in-one suite with Database, Auth, Storage, Edge Functions, Realtime, and Vector search. Use one or all. Build in a weekend. Scale to millions.',
    cliCommand: 'projects service add supabase',
  },
  {
    name: 'Railway', category: 'hosting', url: 'https://railway.app', logo: RailwayLogo, lightInvert: true,
    description: 'Infrastructure for devs',
    longDescription: 'Railway is the all-in-one intelligent cloud provider. Our mission is to build the cloud computing stack that unburdens you, so you can focus on what matters to you. Railway was born in 2020 with the tagline "Infrastructure, instantly." From this founding concept, we\'ve rebuilt the entire cloud computing stack to help usher in a new golden age of software creation.',
    cliCommand: 'projects service add railway',
  },
  {
    name: 'Neon', category: 'database', url: 'https://neon.tech', logo: NeonLogo,
    description: 'Serverless Postgres',
    longDescription: 'Neon, a Databricks company, is a fully-managed Postgres database platform built on a distributed architecture that separates storage and compute, delivering an automated operational model perfect for today\'s AI-powered development. Tens of thousands of companies like Meta, Doordash, Replit and Pepsi use Neon\'s instant provisioning, autoscaling, and branching to ship and scale applications faster.',
    cliCommand: 'projects service add neon',
  },
  {
    name: 'Chroma', category: 'ai', url: 'https://trychroma.com', logo: ChromaLogo,
    description: 'AI-native vector database',
    longDescription: 'Fast, serverless, and scalable search engine supporting vector, full-text, regex, and metadata search. Built on object storage and trusted by millions of developers. Open-source Apache 2.0.',
    cliCommand: 'projects service add chroma',
  },
  {
    name: 'Sentry', category: 'monitoring', url: 'https://sentry.io', logo: SentryLogo, lightInvert: true, hidden: true,
    description: 'Error monitoring',
    longDescription: 'Catch errors before your users do. Sentry provides full-stack error monitoring, performance tracing, and alerting — all pre-configured with zero setup.',
    cliCommand: 'projects service add sentry',
  },
  {
    name: 'Clerk', category: 'auth', url: 'https://clerk.dev', logo: ClerkLogo,
    description: 'Auth & user management',
    longDescription: 'Drop-in authentication with social login, magic links, MFA, and full user management UI. Works out of the box with zero configuration.',
    cliCommand: 'projects service add clerk',
  },
  {
    name: 'PostHog', category: 'analytics', url: 'https://posthog.com', logo: PostHogLogo,
    description: 'Product analytics',
    longDescription: 'PostHog is the single platform for software teams -- with analytics, session replay, feature flags, A/B testing, data warehouse, CDP, and more all in one AI-powered platform. Open-source and with transparent, usage based pricing, PostHog is trusted by over 190,000 teams to help them build better products.',
    cliCommand: 'projects service add posthog',
  },
  {
    name: 'Vercel', category: 'hosting', url: 'https://vercel.com', logo: VercelLogo, lightInvert: true,
    description: 'Frontend cloud platform',
    longDescription: 'Deploy frontend apps to the edge with automatic CI/CD, edge functions, and global CDN distribution. Seamless integration with Next.js and all major frameworks.',
    cliCommand: 'projects service add vercel',
  },
  {
    name: 'Turso', category: 'database', url: 'https://turso.tech', logo: TursoLogo,
    description: 'SQLite for the agentic era',
    longDescription: 'Turso Cloud gives AI agents the fast, durable, and isolated state they need to run reliably at scale. Each agent gets its own lightweight, replicated SQLite‑compatible database with fast reads, built-in vector search, and automatic sync. Agents can reason locally, store memory, and act without round‑trips to a central service, all while Turso Cloud handles replication, isolation, and performance behind the scenes.',
    cliCommand: 'projects service add turso',
  },
  {
    name: 'Runloop', category: 'ai', url: 'https://runloop.ai', logo: RunloopLogo, lightInvert: true,
    description: 'AI dev infrastructure',
    longDescription: 'Runloop.ai provides secure execution infrastructure for AI agents. Users can run agent workloads inside isolated micro-VM sandboxes, allowing agents to safely execute code, use tools, and access external systems without exposing credentials or production environments. With built-in network policies, secret isolation, and evaluation tooling, Runloop helps teams deploy and operate AI agents in production with security, reliability, and control. Focus on your agent and let us handle the rest.',
    cliCommand: 'projects service add runloop',
  },
  {
    name: '__more__', category: 'database', url: '#', logo: DatabasePlaceholderLogo,
    description: 'More providers coming soon',
    longDescription: 'Additional integrations are on the way.',
    cliCommand: 'projects service add database',
  },
  {
    name: 'Stripe', category: 'payments', url: 'https://stripe.com', logo: StripeLogo,
    description: 'Payments infrastructure',
    longDescription: 'Accept one-time payments, subscriptions, and invoices from day one. Stripe is pre-wired — no boilerplate required. Used by millions of businesses worldwide.',
    cliCommand: 'projects service add stripe',
  },
];


function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    payments:   '#635BFF',
    auth:       '#6C47FF',
    database:   '#22c55e',
    storage:    '#3ECF8E',
    monitoring: '#ef4444',
    analytics:  '#F54E00',
    ai:         '#FF6B35',
    hosting:    '#00b3d4',
  };
  return colors[category];
}

/* ── helpers ─────────────────────────────────────────────────────────────── */

/** Fisher-Yates shuffle keeping Stripe then Database pinned at the end (in that order). */
export function shufflePartners(partners: Partner[]): Partner[] {
  const visible  = partners.filter(p => !p.hidden);
  const stripe   = visible.find(p => p.name === 'Stripe');
  const more     = visible.find(p => p.url === '#');          // "more providers" placeholder
  const rest     = visible.filter(p => p !== stripe && p !== more);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const tail = [...(stripe ? [stripe] : []), ...(more ? [more] : [])];
  return [...rest, ...tail];
}


/* ── EcosystemIcons ──────────────────────────────────────────────────────────
   Desktop window content: draggable app-icon grid of partners.
   Double-click an icon → onOpen(partner) to open a detail window.
─────────────────────────────────────────────────────────────────────────── */

const ICON_W    = 60;            // cell width (was 80, –25%)
const ICON_BOX  = 24;            // icon render size in px (was 32, –25%)
const HIGHLIGHT = ICON_BOX + 16; // highlight box = icon + 8px padding each side
const GAP_X     = 30;            // horizontal gap between icon cells (was 40, –25%)
const GAP_Y     = 30;            // vertical gap between icon rows (was 40, –25%)
const PAD       = 40;            // padding inside window on all sides
const COLS      = 5;             // icons per row (was 4; extra column for wide-screen layout)

// Total pixel dimensions of the icon grid content (used by Desktop.tsx to size the window)
const ECO_ROWS = Math.ceil((PARTNERS.length + 1) / COLS); // +1 for Join icon
export const ECO_CONTENT_W = PAD + COLS * ICON_W + (COLS - 1) * GAP_X + PAD;
export const ECO_CONTENT_H = PAD + ECO_ROWS * (HIGHLIGHT + 16 + 14) + (ECO_ROWS - 1) * GAP_Y + PAD;

export interface EcosystemHandle {
  shuffle:            () => void;
  resetIconPosition:  (name: string) => void;
}

function makeGridPositions(partners: Partner[]): Record<string, { x: number; y: number }> {
  const out: Record<string, { x: number; y: number }> = {};
  partners.forEach((p, i) => {
    out[p.name] = {
      x: PAD + (i % COLS) * (ICON_W + GAP_X),
      y: PAD + Math.floor(i / COLS) * (HIGHLIGHT + 16 + 14 + GAP_Y), // highlight + gap + label + row gap
    };
  });
  return out;
}

export interface EcosystemIconsProps {
  onOpen:             (p: Partner, iconOrigin?: { x: number; y: number }) => void;
  onOpenJoin?:        (iconOrigin?: { x: number; y: number }) => void;
  onCrossDragStart?:  (p: Partner) => void;
  onCrossDragMove?:   (x: number, y: number) => void;
  onCrossDragEnd?:    (p: Partner, x: number, y: number) => void;
  activeFilter?:      Category | null;
}

// Unified cell component for every partner slot in EcosystemIcons.
// When partner.url === '#', renders the self-contained rotating "more providers" teaser.
// Otherwise renders the standard logo + label.
function PartnerCell({
  partner, pos, isDragging, isSelected, onPointerDown, onClick,
}: {
  partner:      Partner;
  pos:          { x: number; y: number };
  isDragging:   boolean;
  isSelected:   boolean;
  onPointerDown:(e: React.PointerEvent<HTMLDivElement>) => void;
  onClick:      (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const isMore = partner.url === '#';

  const [moreIdx,     setMoreIdx]     = useState(0);
  const [moreOpacity, setMoreOpacity] = useState(1);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isMore) return;
    const id = setInterval(() => {
      setMoreOpacity(0);
      fadeRef.current = setTimeout(() => {
        setMoreIdx(i => (i + 1) % ROTATING_MORE_PROVIDERS.length);
        setMoreOpacity(1);
      }, 350);
    }, 5000);
    return () => { clearInterval(id); if (fadeRef.current) clearTimeout(fadeRef.current); };
  }, [isMore]);

  const C = 6, S = 'var(--color-pink)', b = `1px solid ${S}`;
  const corners: React.CSSProperties[] = [
    { top: 0, left: 0,  borderTop: b, borderLeft:  b },
    { top: 0, right: 0, borderTop: b, borderRight: b },
    { bottom: 0, right: 0, borderBottom: b, borderRight: b },
    { bottom: 0, left: 0,  borderBottom: b, borderLeft:  b },
  ];

  const { icon: MoreIcon, name: moreName } = ROTATING_MORE_PROVIDERS[moreIdx];

  return (
    <div
      style={{
        position:  'absolute',
        left:       pos.x,
        top:        pos.y,
        width:      ICON_W,
        cursor:     isDragging ? 'grabbing' : 'pointer',
        userSelect: 'none',
        zIndex:     isDragging ? 5 : 1,
        visibility: isDragging ? 'hidden' : 'visible',
      }}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <div style={{
        width:          HIGHLIGHT,
        height:         HIGHLIGHT,
        margin:        '0 auto',
        position:      'relative',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
      }}>
        {isSelected && corners.map((s, i) => (
          <span key={i} aria-hidden style={{ position: 'absolute', width: C, height: C, pointerEvents: 'none', ...s }} />
        ))}
        {isMore ? (
          <div style={{
            width:         ICON_BOX,
            height:        ICON_BOX,
            display:      'flex',
            alignItems:   'center',
            justifyContent:'center',
            color:         'var(--color-text-secondary)',
            opacity:        moreOpacity,
            transition:   'opacity 0.35s ease',
          }}>
            <MoreIcon className='w-full h-full' />
          </div>
        ) : (
          <div style={{ width: ICON_BOX, height: ICON_BOX, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               className={[partner.lightInvert && 'logo-on-light', partner.darkWhite && 'logo-dark-white'].filter(Boolean).join(' ')}>
            <partner.logo className='w-full h-full object-contain' />
          </div>
        )}
      </div>

      {isMore ? (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <p style={{
            textAlign:     'center',
            fontSize:      '0.62rem',
            margin:         0,
            color:         isSelected ? 'var(--color-text-ui)' : 'var(--color-text-secondary)',
            fontFamily:    'var(--font-mono)',
            transition:    'color 0.1s',
            lineHeight:     1.2,
            opacity:        moreOpacity,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {moreName}
          </p>
          <p style={{
            textAlign:     'center',
            fontSize:      '0.62rem',
            margin:         0,
            color:         isSelected ? 'var(--color-text-ui)' : 'var(--color-text-secondary)',
            fontFamily:    'var(--font-mono)',
            lineHeight:     1.2,
            transition:    'color 0.1s',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            More coming
          </p>
        </div>
      ) : (
        partner.name && partner.name !== '__more__' && (
          <p style={{
            textAlign:     'center',
            fontSize:      '0.62rem',
            marginTop:      16,
            color:         isSelected ? 'var(--color-text-ui)' : 'var(--color-text-secondary)',
            fontFamily:    'var(--font-mono)',
            transition:    'color 0.1s',
            lineHeight:     1.2,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {partner.name}
          </p>
        )
      )}
    </div>
  );
}

export const EcosystemIcons = forwardRef<EcosystemHandle, EcosystemIconsProps>(
  function EcosystemIcons({ onOpen, onOpenJoin, onCrossDragStart, onCrossDragMove, onCrossDragEnd, activeFilter }, ref) {
    const [order,        setOrder]        = useState<Partner[]>(() => shufflePartners(PARTNERS));
    const [positions,    setPositions]    = useState(() => makeGridPositions(shufflePartners(PARTNERS)));
    const [dragging,     setDragging]     = useState<string | null>(null);
    const [selected,     setSelected]     = useState<number | null>(null);
    const [displaySlots, setDisplaySlots] = useState<Partner[]>(PARTNERS);
    const [isShuffling,  setIsShuffling]  = useState(false);
    const shuffleTimers  = useRef<ReturnType<typeof setTimeout>[]>([]);
    const containerRef   = useRef<HTMLDivElement>(null);

    // Reset order+positions whenever PARTNERS data changes (e.g. after HMR), so stale
    // React state never holds partner objects or position keys from an old version.
    const partnersKey = PARTNERS.map(p => `${p.name}|${p.url}`).join(',');
    const partnersKeyRef = useRef(partnersKey);
    useEffect(() => {
      if (partnersKeyRef.current !== partnersKey) {
        partnersKeyRef.current = partnersKey;
        const fresh = shufflePartners(PARTNERS);
        setOrder(fresh);
        setPositions(makeGridPositions(fresh));
      }
    }, [partnersKey]);

    useEffect(() => () => {
      shuffleTimers.current.forEach(id => { clearTimeout(id); clearInterval(id as unknown as ReturnType<typeof setInterval>); });
    }, []);

    /* ── shuffle: cascade slot-machine animation ─────────────── */
    const shuffle = useCallback(() => {
      // Cancel any in-progress shuffle
      shuffleTimers.current.forEach(id => { clearTimeout(id); clearInterval(id as unknown as ReturnType<typeof setInterval>); });
      shuffleTimers.current = [];

      const nextOrder = [...PARTNERS].sort(() => Math.random() - 0.5);
      const n = PARTNERS.length;

      setIsShuffling(true);
      setSelected(null);
      // Seed displaySlots from current order so positions don't jump
      setDisplaySlots([...order]);

      const STAGGER       = 150; // ms between each slot starting
      const CYCLE_DURATION = 480; // ms each slot spins before settling
      const CYCLE_SPEED   = 70;  // ms between random icon swaps

      for (let i = 0; i < n; i++) {
        const startAt = i * STAGGER;
        const endAt   = startAt + CYCLE_DURATION;

        let cycleInterval: ReturnType<typeof setInterval>;

        const startId = setTimeout(() => {
          cycleInterval = setInterval(() => {
            const rand = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];
            setDisplaySlots(prev => { const s = [...prev]; s[i] = rand; return s; });
          }, CYCLE_SPEED);
          shuffleTimers.current.push(cycleInterval as unknown as ReturnType<typeof setTimeout>);
        }, startAt);

        const endId = setTimeout(() => {
          clearInterval(cycleInterval);
          setDisplaySlots(prev => { const s = [...prev]; s[i] = nextOrder[i]; return s; });

          if (i === n - 1) {
            setOrder(nextOrder);
            setPositions(makeGridPositions(nextOrder));
            setIsShuffling(false);
          }
        }, endAt);

        shuffleTimers.current.push(startId, endId);
      }
    }, [order]);

    const resetIconPosition = useCallback((name: string) => {
      setPositions(prev => {
        const gridPos = makeGridPositions(order)[name];
        if (!gridPos) return prev;
        return { ...prev, [name]: gridPos };
      });
    }, [order]);

    useImperativeHandle(ref, () => ({ shuffle, resetIconPosition }), [shuffle, resetIconPosition]);

    /* ── drag ─────────────────────────────────────────────────── */
    function startDrag(e: RPE<HTMLDivElement>, name: string) {
      if (e.button !== 0 || isShuffling) return;
      e.preventDefault();
      e.stopPropagation();
      const sx = e.clientX, sy = e.clientY;
      const sp = { ...positions[name] };
      const partner = order.find(p => p.name === name)!;
      let dragStarted = false;
      const THRESHOLD = 5;
      function onMove(ev: globalThis.PointerEvent) {
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        if (!dragStarted) {
          if (Math.sqrt(dx * dx + dy * dy) < THRESHOLD) return;
          dragStarted = true;
          setDragging(name);
          onCrossDragStart?.(partner);
        }
        setPositions(prev => ({ ...prev, [name]: { x: sp.x + dx, y: sp.y + dy } }));
        onCrossDragMove?.(ev.clientX, ev.clientY);
      }
      function onUp(ev: globalThis.PointerEvent) {
        if (dragStarted) {
          setDragging(null);
          onCrossDragEnd?.(partner, ev.clientX, ev.clientY);
        }
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup',   onUp);
      }
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup',   onUp);
    }

    /* ── keyboard navigation ──────────────────────────────────── */
    function handleKeyDown(e: React.KeyboardEvent) {
      const n = order.length + 1; // +1 for the Join item
      if (selected === null) {
        if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.key)) {
          e.preventDefault();
          setSelected(0);
        }
        return;
      }
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); setSelected(Math.min(n - 1, selected + 1)); break;
        case 'ArrowLeft':  e.preventDefault(); setSelected(Math.max(0, selected - 1)); break;
        case 'ArrowDown':  e.preventDefault(); setSelected(Math.min(n - 1, selected + COLS)); break;
        case 'ArrowUp':    e.preventDefault(); setSelected(Math.max(0, selected - COLS)); break;
        case 'Enter':
          e.preventDefault();
          if (selected === order.length) onOpenJoin?.();
          else onOpen(order[selected]);
          break;
        case 'Escape':     setSelected(null); break;
      }
    }

    /* ── single click opens the detail window ──────────────────── */
    function handleIconClick(e: React.MouseEvent, idx: number, partner: typeof order[number]) {
      e.stopPropagation();
      setSelected(idx);
      containerRef.current?.focus();
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      onOpen(partner, {
        x: rect.left + rect.width  / 2,
        y: rect.top  + rect.height / 2,
      });
    }

    // when filtering, show only matching partners at fresh grid positions
    const visible         = activeFilter ? order.filter(p => p.category === activeFilter) : order;
    const filteredGridPos = activeFilter ? makeGridPositions(visible) : null;

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setSelected(null)}
        onBlur={() => setSelected(null)}
        style={{ position: 'relative', width: ECO_CONTENT_W, height: ECO_CONTENT_H, flexShrink: 0, overflow: 'hidden', outline: 'none' }}
      >
        {(isShuffling ? displaySlots : visible).map((partner, idx) => {
          const pos = isShuffling
            ? { x: PAD + (idx % COLS) * (ICON_W + GAP_X), y: PAD + Math.floor(idx / COLS) * (HIGHLIGHT + 16 + 14 + GAP_Y) }
            : (filteredGridPos ? filteredGridPos[partner.name] : positions[partner.name]);
          if (!pos) return null;
          const isDragging = !isShuffling && dragging === partner.name;
          const isSelected = !isShuffling && selected === idx;

          return (
            <PartnerCell
              key={isShuffling ? idx : (partner.name || partner.url)}
              partner={partner}
              pos={pos}
              isDragging={isDragging}
              isSelected={isSelected}
              onPointerDown={e => startDrag(e, partner.name)}
              onClick={e => handleIconClick(e, idx, partner)}
            />
          );
        })}

        {/* ── Join icon — always last, never shuffled ───────────────── */}
        {(() => {
          const joinIdx = visible.length;
          const joinPos = {
            x: PAD + (joinIdx % COLS) * (ICON_W + GAP_X),
            y: PAD + Math.floor(joinIdx / COLS) * (HIGHLIGHT + 16 + 14 + GAP_Y),
          };
          const isJoinSelected = !isShuffling && selected === joinIdx;
          const C = 6;
          const S = 'var(--color-pink)';
          const b = `1px solid ${S}`;
          const corners: React.CSSProperties[] = [
            { top: 0, left: 0,  borderTop: b, borderLeft:  b },
            { top: 0, right: 0, borderTop: b, borderRight: b },
            { bottom: 0, right: 0, borderBottom: b, borderRight: b },
            { bottom: 0, left: 0,  borderBottom: b, borderLeft:  b },
          ];
          return (
            <div
              key="join"
              style={{
                position:  'absolute',
                left:       joinPos.x,
                top:        joinPos.y,
                width:      ICON_W,
                cursor:     'pointer',
                userSelect: 'none',
                zIndex:     1,
              }}
              onClick={e => {
                if (isShuffling) return;
                e.stopPropagation();
                setSelected(joinIdx);
                containerRef.current?.focus();
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                onOpenJoin?.({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
              }}
            >
              <div style={{
                width:          HIGHLIGHT,
                height:         HIGHLIGHT,
                margin:        '0 auto',
                position:      'relative',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
              }}>
                {isJoinSelected && corners.map((s, i) => (
                  <span key={i} aria-hidden style={{
                    position: 'absolute', width: C, height: C, pointerEvents: 'none', ...s,
                  }} />
                ))}
                <div style={{ width: ICON_BOX, height: ICON_BOX, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img
                    src="/you.png"
                    alt="Join"
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.6)' }}
                  />
                </div>
              </div>
              <p style={{
                textAlign:  'center',
                fontSize:   '0.62rem',
                marginTop:   16,
                color:      isJoinSelected ? 'var(--color-text-ui)' : 'var(--color-text-ui-muted)',
                fontFamily: 'var(--font-mono)',
                transition: 'color 0.1s',
                lineHeight:  1.2,
              }}>
                Join
              </p>
            </div>
          );
        })()}
      </div>
    );
  }
);

/* ── EcoFilterButton ──────────────────────────────────────────────────────────
   Filter icon button + popover for the ecosystem window header.
─────────────────────────────────────────────────────────────────────────── */

export function EcoFilterButton({
  activeFilter,
  onFilter,
}: {
  activeFilter: Category | null;
  onFilter: (c: Category | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const CATS_USED = CATEGORIES.filter(c => PARTNERS.some(p => p.category === c));
  const DIM  = 'var(--color-text-ui-muted)';
  const PINK = 'var(--color-pink)';

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        aria-label='Filter by category'
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          display: 'flex', alignItems: 'center', background: 'none', border: 'none',
          padding: 0, cursor: 'pointer',
          color: activeFilter ? PINK : DIM,
        }}
      >
        <SlidersHorizontal size={10} strokeWidth={1.5} />
      </button>

      {open && (
        <div style={{
          position:    'absolute',
          top:         'calc(100% + 6px)',
          right:       0,
          background:  'var(--color-surface-dark)',
          border:      '1px solid var(--color-border-accent)',
          padding:     '4px',
          zIndex:      9999,
          minWidth:    110,
          display:     'flex',
          flexDirection: 'column',
          gap:           2,
          fontFamily:  'var(--font-mono)',
          fontSize:    '0.68rem',
        }}>
          {/* "All" clears the filter */}
          <button
            onClick={() => { onFilter(null); setOpen(false); }}
            style={{
              textAlign:   'left',
              padding:     '3px 8px',
              background:  activeFilter === null ? 'rgba(255,255,255,0.06)' : 'none',
              border:      'none',
              cursor:      'pointer',
              color:       activeFilter === null ? PINK : DIM,
              borderRadius: 2,
            }}
          >
            all
          </button>
          {CATS_USED.map(cat => (
            <button
              key={cat}
              onClick={() => { onFilter(cat === activeFilter ? null : cat); setOpen(false); }}
              style={{
                textAlign:    'left',
                padding:      '3px 8px',
                background:   activeFilter === cat ? 'rgba(255,255,255,0.06)' : 'none',
                border:       'none',
                cursor:       'pointer',
                color:        activeFilter === cat ? PINK : DIM,
                borderRadius:  2,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PartnerDetail ────────────────────────────────────────────────────────────
   Content rendered inside a partner detail window.
─────────────────────────────────────────────────────────────────────────── */

const CATEGORY_COLOR: Record<Category, string> = {
  payments:   '#635BFF',
  auth:       '#6C47FF',
  database:   '#22c55e',
  storage:    '#3ECF8E',
  monitoring: '#ef4444',
  analytics:  '#F54E00',
  ai:         '#FF6B35',
  hosting:    '#00b3d4',
};

export function PartnerDetail({ partner, onShowMe }: { partner: Partner; onShowMe?: (cmd: string) => void }) {
  const isMobile = useIsMobile();
  const catColor = CATEGORY_COLOR[partner.category];
  return (
    <div style={{
      padding:    '1.25rem',
      fontFamily: 'var(--font-mono)',
      display:    'flex',
      flexDirection: 'column',
      gap:        '1rem',
    }}>
      {/* header: logo + name + category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: 44, height: 44, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--color-border-accent)', background: 'var(--color-surface)',
        }} className={[partner.lightInvert && 'logo-on-light', partner.darkWhite && 'logo-dark-white'].filter(Boolean).join(' ')}>
          <partner.logo className='w-7 h-7 object-contain' />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-ui)', margin: 0, lineHeight: 1.2 }}>
            {partner.name}
          </h2>
          <span style={{
            display: 'inline-block', marginTop: 4,
            fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em',
            color: catColor, border: `1px solid ${catColor}33`,
            padding: '1px 6px',
          }}>
            {partner.category}
          </span>
        </div>
      </div>

      {/* description */}
      <p style={{
        fontSize: '0.75rem', color: 'var(--color-text-ui-muted)',
        lineHeight: 1.65, margin: 0,
      }}>
        {partner.longDescription}
      </p>

      {/* CLI install command */}
      <div style={{ border: '1px solid var(--color-border-accent)', background: 'var(--color-surface)' }}>
        <div style={{
          padding: '0.4rem 0.875rem',
          borderBottom: '1px solid var(--color-border-accent)',
          fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em',
          color: 'var(--color-text-ui-subtle)',
        }}>
          install command
        </div>
        <div style={{ padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: 'var(--color-pink)', fontSize: '0.75rem' }}>›</span>
          <code style={{ fontSize: '0.78rem', color: 'var(--color-text-ui)', letterSpacing: '0.02em' }}>
            {partner.cliCommand}
          </code>
        </div>
        {!isMobile && (
          <button
            onClick={() => onShowMe?.(partner.cliCommand)}
            style={{
              display:      'block',
              width:        '100%',
              padding:      '0.5rem 0.875rem',
              background:   'transparent',
              border:       'none',
              borderTop:    '1px solid var(--color-border-accent)',
              textAlign:    'left',
              fontFamily:   'var(--font-mono)',
              fontSize:     '0.72rem',
              color:        'var(--color-pink)',
              cursor:       onShowMe ? 'pointer' : 'default',
              letterSpacing:'0.02em',
            }}
          >
            show me →
          </button>
        )}
      </div>
    </div>
  );
}

/* ── MoreProviderCard — rotating "coming soon" card for the scroll section ── */

function MoreProviderCard({ index }: { index: number }) {
  const [idx,     setIdx]     = useState(0);
  const [opacity, setOpacity] = useState(1);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setOpacity(0);
      fadeRef.current = setTimeout(() => {
        setIdx(i => (i + 1) % ROTATING_MORE_PROVIDERS.length);
        setOpacity(1);
      }, 350);
    }, 5000);
    return () => { clearInterval(id); if (fadeRef.current) clearTimeout(fadeRef.current); };
  }, []);

  const { icon: Icon, name: currentName } = ROTATING_MORE_PROVIDERS[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      className='relative flex flex-col items-center gap-3 rounded-xl p-5 text-center'
      style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
    >
      <span
        className='absolute top-3 right-3 w-1.5 h-1.5 rounded-full'
        style={{ background: getCategoryColor('database') }}
      />
      <div
        className='w-10 h-10 flex items-center justify-center'
        style={{ color: 'var(--color-text-ui-muted)', opacity, transition: 'opacity 0.35s ease' }}
      >
        <Icon className='w-10 h-10 object-contain' />
      </div>
      <div style={{ opacity, transition: 'opacity 0.35s ease' }}>
        <p className='text-sm font-semibold' style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
          {currentName.charAt(0).toUpperCase() + currentName.slice(1)}
        </p>
        <p className='text-xs mt-0.5 leading-tight' style={{ color: 'var(--color-text-disabled)', fontFamily: 'var(--font-mono)' }}>
          coming soon
        </p>
      </div>
    </motion.div>
  );
}

/* ── Partners (original scroll section) ─────────────────────────────────── */

export function Partners() {
  const { theme } = useTheme();
  const isHelmWave = theme === 'helm-wave';
  return (
    <section id='integrations' className='relative py-24 px-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Section heading */}
        <InView
          className='text-center mb-14'
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className='text-xs font-medium tracking-widest uppercase mb-3' style={{ color: 'var(--color-text-muted)' }}>
            Ecosystem
          </p>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>Works with your stack</h2>
          <p className='text-lg max-w-xl mx-auto' style={{ color: 'var(--color-text-secondary)' }}>
            Stripe Projects integrates with the tools you already use. Pick your preferred providers during setup.
          </p>
        </InView>

        {/* Partner grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
          {PARTNERS.map((partner, i) => {
            if (partner.name === '__more__') {
              return <MoreProviderCard key='__more__' index={i} />;
            }
            return (
              <motion.a
                key={partner.name}
                href={partner.url}
                target='_blank'
                rel='noopener noreferrer'
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                className='group relative flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-200'
                style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-strong)';
                  (e.currentTarget as HTMLAnchorElement).style.background  = 'var(--color-surface-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLAnchorElement).style.background  = 'var(--color-surface)';
                }}
              >
                <span
                  className='absolute top-3 right-3 w-1.5 h-1.5 rounded-full'
                  style={{ background: getCategoryColor(partner.category) }}
                />
                <div className={['w-10 h-10 flex items-center justify-center', partner.lightInvert && 'logo-on-light', partner.darkWhite && 'logo-dark-white'].filter(Boolean).join(' ')}>
                  <partner.logo className='w-10 h-10 object-contain' />
                </div>
                <div>
                  <p className='text-sm font-semibold' style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{partner.name}</p>
                  <p className='text-xs mt-0.5 leading-tight' style={{ color: 'var(--color-text-disabled)', fontFamily: 'var(--font-mono)' }}>{partner.description}</p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Provider footer strip */}
        <InView
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '12px',
            marginTop:      '40px',
            fontFamily:     'var(--font-mono)',
            fontSize:       '0.72rem',
            letterSpacing:  '0.02em',
          }}>
          <span style={{ color: 'var(--color-text-ui-muted)' }}>
            More providers are on the way
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { href: 'mailto:provider-request@stripe.com?subject=Provider%20Partnership', label: 'Become a provider' },
              { href: 'mailto:provider-request@stripe.com?subject=Provider%20Suggestion',  label: 'Suggest a provider' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  gap:            '0.3em',
                  padding:        '0.5rem 0.85rem',
                  color:          isHelmWave ? 'rgba(58,32,96,0.9)' : 'var(--color-text-ui)',
                  border:         isHelmWave ? '1px solid rgba(255,255,255,0.7)' : '1px solid var(--color-border-accent)',
                  background:     isHelmWave ? 'none' : 'var(--color-bg)',
                  borderRadius:   isHelmWave ? '999px' : undefined,
                  textDecoration: 'none',
                  letterSpacing:  '0.04em',
                  flexShrink:     0,
                  transition:     isHelmWave ? 'color 0.2s ease, border-color 0.2s ease' : 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  if (isHelmWave) {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#635BFF';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.7)';
                  } else {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-pink)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-pink)';
                  }
                }}
                onMouseLeave={e => {
                  if (isHelmWave) {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(58,32,96,0.9)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.7)';
                  } else {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-accent)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-ui)';
                  }
                }}
              >
                {label} <ArrowUpRight size={10} strokeWidth={1.5} />
              </a>
            ))}
          </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
