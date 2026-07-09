export type PageId =
  | "home"
  | "about-history"
  | "about-overview"
  | "about-location"
  | "gov-leadership"
  | "gov-structure"
  | "gov-offices"
  | "svc-education"
  | "svc-health"
  | "svc-agriculture"
  | "svc-transport"
  | "svc-water"
  | "svc-justice"
  | "svc-finance"
  | "news-news"
  | "news-bids"
  | "news-vacancy"
  | "news-announcements"
  | "gallery"
  | "vacancy"
  | "bids"
  | "contact";

export interface NavItem {
  label: string;
  href: PageId;
  children?: { label: string; href: PageId; icon: React.ElementType }[];
}