import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { LoginButton } from "@/components/LoginButton";
import { StarfieldBackground } from "@/components/StarfieldBackground";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/galaxy");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-5 text-white">
      <StarfieldBackground />
      <section className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <p className="eyebrow mb-5 text-spotify-neon">establishing transmission</p>
        <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-normal text-white sm:text-7xl lg:text-8xl">
          your music universe
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
          Powering up the telescope for a bold Spotify-green galaxy built from your top tracks,
          artists, genres, and listening orbit.
        </p>
        <div className="mt-10">
          <LoginButton />
        </div>
        <div className="mt-10 grid w-full max-w-xl grid-cols-3 gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/54">
          <span className="border border-spotify-green/30 bg-spotify-green/10 px-3 py-3 text-spotify-neon">
            auth link
          </span>
          <span className="border border-galaxy-cyan/30 bg-galaxy-cyan/10 px-3 py-3 text-galaxy-cyan">
            telescope
          </span>
          <span className="border border-galaxy-purple/30 bg-galaxy-purple/10 px-3 py-3 text-galaxy-ice">
            data pulse
          </span>
        </div>
      </section>
    </main>
  );
}
