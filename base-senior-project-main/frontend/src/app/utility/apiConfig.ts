const baseUrl = 'https://dou6dqw5wa.execute-api.us-east-1.amazonaws.com';

export async function fetchData(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    return [];
  }
}
