import { useEffect, useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import { supabase, PropertyVideo } from '../lib/supabase';
import { trackContact } from '../lib/tracking';

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
    /[?&]v=([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

function buildEmbedUrl(url: string): string {
  const yt = getYouTubeId(url);
  if (yt) {
    return `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  const vm = getVimeoId(url);
  if (vm) return `https://player.vimeo.com/video/${vm}?autoplay=1`;
  return url;
}

function buildWatchUrl(url: string): string {
  const yt = getYouTubeId(url);
  if (yt) return `https://www.youtube.com/watch?v=${yt}`;
  const vm = getVimeoId(url);
  if (vm) return `https://vimeo.com/${vm}`;
  return url;
}

function getThumbnail(video: PropertyVideo): string {
  if (video.thumbnail_url) return video.thumbnail_url;
  const yt = getYouTubeId(video.video_url);
  if (yt) return `https://img.youtube.com/vi/${yt}/hqdefault.jpg`;
  return 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800';
}

export default function PropertyVideos() {
  const [videos, setVideos] = useState<PropertyVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<PropertyVideo | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  const loadVideos = async () => {
    const { data } = await supabase
      .from('property_videos')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    setVideos((data as PropertyVideo[]) || []);
    setLoading(false);
  };

  if (loading) return null;
  if (videos.length === 0) return null;

  return (
    <div className="mt-24 md:mt-32">
      <div className="text-center mb-16">
        <p className="font-lato text-xs text-charcoal/50 uppercase tracking-widest mb-4">
          Watch & Explore
        </p>
        <h3 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-light text-charcoal uppercase tracking-wider mb-6">
          Property Video Tours
        </h3>
        <p className="font-lato text-base text-charcoal/70 max-w-2xl mx-auto">
          Step inside our exclusive listings and see the lifestyle for yourself
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => {
              setActiveVideo(video);
              trackContact('video_play');
            }}
            className="group text-left"
            aria-label={`Play video: ${video.title}`}
          >
            <div className="relative aspect-video overflow-hidden bg-charcoal/5">
              <img
                src={getThumbnail(video)}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cream/95 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play className="w-7 h-7 md:w-8 md:h-8 text-charcoal ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <h4 className="font-montserrat text-lg uppercase tracking-wide text-charcoal mb-2 group-hover:opacity-70 transition-opacity">
                {video.title}
              </h4>
              {video.description && (
                <p className="font-lato text-sm text-charcoal/70 leading-relaxed line-clamp-2">
                  {video.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute -top-12 right-0 text-cream hover:opacity-70 transition-opacity"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {activeVideo.video_type === 'embed' ? (
                <iframe
                  src={buildEmbedUrl(activeVideo.video_url)}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <video
                  src={activeVideo.video_url}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                  aria-label={activeVideo.title}
                >
                  <source src={activeVideo.video_url} type="video/mp4" />
                </video>
              )}
            </div>
            <div className="mt-4 text-center">
              <h4 className="font-montserrat text-xl uppercase tracking-wide text-cream mb-2">
                {activeVideo.title}
              </h4>
              {activeVideo.description && (
                <p className="font-lato text-sm text-cream/70 max-w-2xl mx-auto whitespace-pre-line">
                  {activeVideo.description}
                </p>
              )}
              {activeVideo.video_type === 'embed' && getYouTubeId(activeVideo.video_url) && (
                <a
                  href={buildWatchUrl(activeVideo.video_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2 border border-cream/40 text-cream hover:bg-cream hover:text-charcoal transition-colors duration-300 font-lato text-xs uppercase tracking-widest"
                >
                  Watch on YouTube
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
