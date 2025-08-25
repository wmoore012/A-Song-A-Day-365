export interface Playlist {
  id: string;
  name: string;
  url: string;
  description: string;
  category: 'studio' | 'focus' | 'ambient' | 'custom';
  isDefault?: boolean;
}

export const PLAYLISTS: Record<string, Playlist> = {
  studioVibes: {
    id: 'studioVibes',
    name: 'Studio Vibes',
    url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_iaE7SmeA8Kj',
    description: 'High-energy beats for creative flow',
    category: 'studio',
    isDefault: true
  },
  focusMate: {
    id: 'focusMate',
    name: 'FocusMate',
    url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_iaE7SmeA8Kj',
    description: 'Deep focus ambient music',
    category: 'focus'
  },
  freeCook: {
    id: 'freeCook',
    name: 'FREE COOK',
    url: 'https://music.youtube.com/playlist?list=PLl-ShioB5kapLuMhLMqdyx_gKX_MBiXeb&si=By4_iaE7SmeA8Kj',
    description: 'No time limit, pure creativity',
    category: 'custom'
  }
};

export const getPlaylistById = (id: string): Playlist | undefined => PLAYLISTS[id];
export const getDefaultPlaylist = (): Playlist => PLAYLISTS.studioVibes;
export const getPlaylistsByCategory = (category: Playlist['category']): Playlist[] => 
  Object.values(PLAYLISTS).filter(p => p.category === category);
