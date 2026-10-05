const apiBaseUrl = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL || "https://support-ticket-dashboard-x4je.onrender.com");

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: { ...(options?.body ? { "Content-Type": "application/json" } : {}), ...options?.headers },
  });
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new Error(`API request failed (${response.status}). Check that the backend is deployed and configured.`);
    }
    throw new Error("The API returned an unexpected response. Check that the backend is deployed and configured.");
  }
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
