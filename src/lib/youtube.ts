export function getYoutubeVideoId(value: string) {
  try {
    const url = new URL(value);
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname)) return null;
    if (url.hostname.endsWith("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] ?? null;
    return url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(value?: string | null) {
  const id = value ? getYoutubeVideoId(value) : null;
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function isYoutubeUrl(value: string) {
  return !value || Boolean(getYoutubeEmbedUrl(value));
}
