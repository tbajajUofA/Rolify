import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginButton } from "@/components/LoginButton";
import { OmnitrixBackground } from "@/components/OmnitrixBackground";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/galaxy");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 text-white">
      <OmnitrixBackground />
      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.32em] text-omnitrix-green/70">
          initializing omnitrix link
        </p>
        <h1 className="font-display max-w-3xl text-4xl font-bold uppercase leading-[0.95] tracking-wide text-omnitrix-green sm:text-6xl lg:text-7xl">
          Wacky Charts feat. Spotify Data
        </h1>
        <p className="mt-7 max-w-xl font-sans text-lg leading-8 text-white/65">
          Connect Spotify and transform your listening data through eight alien visualization
          forms — each a different lens on your top artists, genres, and tracks.
        </p>
        <div className="mt-10">
          <LoginButton />
        </div>
        <Link
          href="/sample"
          className="mt-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-omnitrix-green/45 transition hover:text-omnitrix-green"
        >
          Preview with demo data →
        </Link>
        <div className="mt-10 grid w-full max-w-xl grid-cols-3 gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/45">
          <span className="border border-omnitrix-green/30 bg-omnitrix-green/5 px-3 py-3 text-omnitrix-green">
            auth link
          </span>
          <span className="border border-omnitrix-hourglass/30 bg-omnitrix-hourglass/5 px-3 py-3 text-omnitrix-hourglass">
            dna scan
          </span>
          <span className="border border-omnitrix-green/20 bg-white/5 px-3 py-3 text-white/50">
            transform
          </span>
        </div>
      </section>
    </main>
  );
}
