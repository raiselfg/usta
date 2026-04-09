export const revalidateFrontend = async () => {
  const url = `https://us-ta.ru/api/revalidate?tag=product-categories&secret=${process.env.REVALIDATION_TOKEN}`;

  try {
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) console.error('Failed to revalidate:', await res.text());
  } catch (e) {
    console.error('Error during revalidation call:', e);
  }
};
