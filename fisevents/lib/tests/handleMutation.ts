'use client';

export default async function handleCreate<T>(data: T) {
  try {
    const response = await fetch('/api/sanity', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}