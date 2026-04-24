export interface LandingProduct {
  id: string;
  name: string | null;
  image: string;
}

export interface LandingCategory {
  id: string;
  name: string;
  product: LandingProduct[];
}

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
