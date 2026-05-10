export interface SpotifyImage { url: string; height?: number; width?: number }
export interface SpotifyUser { id: string; display_name?: string; email?: string; images?: SpotifyImage[] }
export interface SpotifyArtist { id: string; name: string; genres: string[]; images?: SpotifyImage[] }
export interface SpotifyAlbum { id: string; name: string; images?: SpotifyImage[] }
export interface SpotifyTrack { id: string; name: string; artists: SpotifyArtist[]; album?: SpotifyAlbum }
export interface AudioFeatures { id: string; energy: number; valence: number; danceability: number; acousticness: number; instrumentalness: number; tempo: number }
