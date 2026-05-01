import type { LandingCategory } from '@usta/types/product-categories';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const url = `${baseUrl}/storefront/landing`;

export async function getLandingData(): Promise<LandingCategory[]> {
  try {
    const res = await fetch(url, {
      cache: 'force-cache',
      next: {
        tags: ['landing-data'],
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    return [];
  }
}
