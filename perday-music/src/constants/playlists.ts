/**
 * Centralized playlist registry
 * MIT licensed - open core
 */

export const PLAYLISTS = {
  default: {
    id: 'default',
    name: 'Perday Music 365',
    description: 'Your daily creative soundtrack',
    url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_iaE7SmeA8Kj'
  },
  'studio-vibes': {
    id: 'studio-vibes',
    name: 'Studio Vibes',
    description: 'High-energy production flow',
    url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_iaE7SmeA8Kj'
  },
  'focus-mate': {
    id: 'focus-mate',
    name: 'FocusMate',
    description: 'Deep concentration beats',
    url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_iaE7SmeA8Kj'
  }
} as const;

export type PlaylistId = keyof typeof PLAYLISTS;
export type Playlist = typeof PLAYLISTS[PlaylistId];
