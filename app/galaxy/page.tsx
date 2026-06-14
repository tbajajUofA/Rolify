import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  getCurrentUserProfile,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks
} from "@/lib/spotify";
import { buildGalaxyData } from "@/lib/galaxyData";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { TasteGalaxy } from "@/components/TasteGalaxy";
import { GravityWell } from "@/components/GravityWell";
import { RedGiants } from "@/components/RedGiants";
import { Supernova } from "@/components/Supernova";
import { Constellations } from "@/components/Constellations";
import { MusicalDNA } from "@/components/MusicalDNA";
import { SpectralAnalysis } from "@/components/SpectralAnalysis";
import { StarClusterBubbleChart } from "@/components/StarClusterBubbleChart";
import { LightCurveBarChart } from "@/components/LightCurveBarChart";
import { GenreStarSystem } from "@/components/GenreStarSystem";
import { OrbitalTrajectory } from "@/components/OrbitalTrajectory";
import { GrandFinale } from "@/components/GrandFinale";

export const dynamic = "force-dynamic";

export default async function GalaxyPage() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    redirect("/");
  }

  const [profile, topArtistsShort, topArtistsLong, topTracksShort, topTracksLong, recentlyPlayed] =
    await Promise.all([
      getCurrentUserProfile(accessToken),
      getTopArtists(accessToken, "short_term", 50),
      getTopArtists(accessToken, "long_term", 50),
      getTopTracks(accessToken, "short_term", 50),
      getTopTracks(accessToken, "long_term", 50),
      getRecentlyPlayed(accessToken, 50)
    ]);

  const galaxy = buildGalaxyData({
    topArtistsShort,
    topArtistsLong,
    topTracksShort,
    topTracksLong,
    recentlyPlayed
  });

  return (
    <main className="relative min-h-screen bg-black text-white">
      <StarfieldBackground />
      <div className="fixed left-0 right-0 top-0 z-30 border-b border-spotify-green/20 bg-black/72 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.2em]">
          <span className="text-spotify-neon">your music universe</span>
          <span className="truncate text-white/62">{profile.display_name || profile.email}</span>
        </div>
      </div>

      <TasteGalaxy tracks={galaxy.tracks} />
      <GravityWell genres={galaxy.genreDistribution} />
      <RedGiants artists={galaxy.redGiants} />
      <Supernova artist={galaxy.supernova} />
      <Constellations artists={galaxy.artistConstellations} />
      <MusicalDNA genres={galaxy.topGenres} />
      <SpectralAnalysis features={galaxy.averageFeatures} />
      <StarClusterBubbleChart tracks={galaxy.tracks} />
      <LightCurveBarChart artists={galaxy.topArtistsLong} />
      <GenreStarSystem genres={galaxy.genreDistribution} />
      <OrbitalTrajectory points={galaxy.recentlyPlayedByDay} />
      <GrandFinale track={galaxy.grandFinale} />
    </main>
  );
}
