import { LandingCategory } from '@usta/types/product-categories';

export async function getLandingData(): Promise<LandingCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}/storefront/landing`;

  const res = await fetch(url, {
    next: {
      tags: ['landing-data'],
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch landing data: ${res.statusText}`);
  }

  return res.json();
}
