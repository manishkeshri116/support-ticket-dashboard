export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { ...(options?.body ? { "Content-Type": "application/json" } : {}), ...options?.headers },
  });
  const data: unknown = await response.json();
  if (!response.ok) {
    const message = typeof data === "object" && data !== null && "error" in data
      && typeof data.error === "object" && data.error !== null && "message" in data.error
      && typeof data.error.message === "string"
      ? data.error.message
      : "Something went wrong. Please try again.";
    throw new Error(message);
  }
  return data as T;
}
