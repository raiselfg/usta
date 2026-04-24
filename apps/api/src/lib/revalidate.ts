export const revalidateFrontend = async () => {
  const tags = ['product-categories', 'landing-data'];
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://us-ta.ru';

  const promises = tags.map(async (tag) => {
    const url = `${baseUrl}/api/revalidate?tag=${tag}&secret=${process.env.REVALIDATION_TOKEN}`;
    try {
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok)
        console.error(`Failed to revalidate ${tag}:`, await res.text());
    } catch (e) {
      console.error(`Error during revalidation call for ${tag}:`, e);
    }
  });

  Promise.all(promises).catch((e) =>
    console.error('Error in revalidation promises:', e),
  );
};
