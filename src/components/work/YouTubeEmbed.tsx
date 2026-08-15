import { cn } from "~/lib/cn";

export interface YouTubeVideo {
  id: string;
  url: string;
  order: number;
}

export interface YouTubeEmbedProps {
  videos: YouTubeVideo[];
  className?: string;
}

export function parseYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id ?? null;
    }

    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) {
        return fromQuery;
      }

      const pathPattern = /\/(?:embed|v|shorts)\/([^/?]+)/;
      const pathMatch = pathPattern.exec(parsed.pathname);
      if (pathMatch?.[1]) {
        return pathMatch[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

function YouTubeIframe({ videoId }: { videoId: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/20">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`YouTube video ${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

export function YouTubeEmbed({ videos, className }: YouTubeEmbedProps) {
  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);

  if (sortedVideos.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {sortedVideos.map((video) => {
        const videoId = parseYouTubeVideoId(video.url);

        if (!videoId) {
          return (
            <div
              key={video.id}
              className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center text-sm text-muted"
            >
              Invalid YouTube URL
            </div>
          );
        }

        return <YouTubeIframe key={video.id} videoId={videoId} />;
      })}
    </div>
  );
}
