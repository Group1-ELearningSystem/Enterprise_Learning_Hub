import client from './client';

export async function loginApi(payload) {
  const { data } = await client.post('/auth/login', payload);
  return data.data;
}
