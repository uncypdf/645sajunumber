import type { MetadataRoute } from "next";
import winners from "@/data/winners.json";
import type { WinnersData } from "@/lib/lotto";

const winnersData = winners as unknown as WinnersData;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.645sajunumber.com";
  const now = new Date();
  const latest = winnersData.latest ?? 0;

  const items: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/lotto-number-recommendation`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  if (latest > 0) {
    items.push({ url: `${base}/draw/${latest}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
    items.push({ url: `${base}/draw/${latest + 1}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  }

  items.push({ url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 });

  items.push({ url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 });
  items.push({ url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 });

  return items;
}
