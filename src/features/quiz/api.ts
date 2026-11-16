export async function request<T>(url: string, data?: unknown): Promise<T> {
  const response = await fetch(url, data === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('A API de quizzes está indisponível.')
  const value = await response.json()
  if (!response.ok) throw new Error(value.error || 'Falha ao acessar o quiz.')
  return value
}
