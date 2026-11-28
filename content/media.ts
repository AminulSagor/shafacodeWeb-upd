/**
 * Videos shown in the demo modal. Set `youtubeId` (or `src` for an MP4 in the
 * media bucket) to enable the player; without one the "Watch demo" controls
 * fall back to the portfolio, as on the previous site.
 */
export type VideoSource = {
  title: string;
  duration: string;
  youtubeId?: string;
  src?: string;
};

export const homeDemoVideo: VideoSource = {
  title: 'How we work',
  duration: '1:32',
  // youtubeId: '', // TODO(owner): add the showreel video
};

export const hasVideo = (v: VideoSource) => Boolean(v.youtubeId || v.src);
