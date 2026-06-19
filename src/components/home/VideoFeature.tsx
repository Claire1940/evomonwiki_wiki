"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // Loop requires playlist param set to the same video id.
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  // Auto-play when the video scrolls into view (fallback: click-to-play).
  useEffect(() => {
    if (activated) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [activated]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActivated(true)}
            aria-label={`Play ${title}`}
            className="group absolute top-0 left-0 h-full w-full"
          >
            {/* Thumbnail cover */}
            <img
              src={thumbUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            {/* Dark overlay for contrast */}
            <span className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/20" />
            {/* Play button */}
            <span
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full
                           bg-[hsl(var(--nav-theme)/0.9)] backdrop-blur-sm
                           ring-4 ring-white/20
                           transition-transform group-hover:scale-110"
              >
                <Play className="h-7 w-7 translate-x-0.5 text-white" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
