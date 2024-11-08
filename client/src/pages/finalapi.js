const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://default-api-url.com';

export default async function handler(req, res) {
  try {
    const response = await fetch(API_URL, {
      method: req.method,
      headers: req.headers,
      body: req.body ? JSON.stringify(req.body) : null,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error connecting to the backend API' });
  }
}
