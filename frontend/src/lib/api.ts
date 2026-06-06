export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { error?: string };
      detail = body.error ? `: ${body.error}` : "";
    } catch {
      /* non-JSON body */
    }
    throw new Error(`${res.status} ${res.statusText}${detail}`);
  }
  return res.json() as Promise<T>;
}

export type Role = "user" | "assistant";

export type Message = {
  id: string;
  role: Role;
  content: string;
  created_at: string;
};

export function postChat(content: string): Promise<Message> {
  return api<Message>("/chat/", {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
