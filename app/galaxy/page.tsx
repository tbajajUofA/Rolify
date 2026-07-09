import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import {
  getCurrentUserProfile,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks
} from "@/lib/spotify";
import { buildChartData } from "@/lib/transformData";
import { OmnitrixBackground } from "@/components/OmnitrixBackground";
import { OmnitrixDashboard } from "@/components/OmnitrixDashboard";

export const dynamic = "force-dynamic";

export default async function GalaxyPage() {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken) {
    redirect("/");
  }

  const [profile, topArtists, topTracks, recentlyPlayed] = await Promise.all([
    getCurrentUserProfile(accessToken),
    getTopArtists(accessToken, "medium_term", 50),
    getTopTracks(accessToken, "medium_term", 50),
    getRecentlyPlayed(accessToken, 50)
  ]);

  const chartData = buildChartData({
    topArtists,
    topTracks,
    recentlyPlayed
  });

  return (
    <main className="relative min-h-screen bg-black text-white">
      <OmnitrixBackground />
      <OmnitrixDashboard
        chartData={chartData}
        displayName={profile.display_name || profile.email || "Operator"}
      />
    </main>
  );
}
