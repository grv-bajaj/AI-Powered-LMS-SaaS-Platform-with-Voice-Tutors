import Image from "next/image";

export default function JourneyLoading() {
  return (
    <main
      className="fixed inset-0 z-[100] m-0 flex h-dvh w-screen max-w-none items-center justify-center px-0 pt-0 bg-background"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="animate-logo-breathe" role="status" aria-label="Loading profile">
        <Image
          src="/images/icon.png"
          alt="Vocalize"
          width={272}
          height={88}
          className="dark:hidden"
          priority
        />
        <Image
          src="/images/icon_dark.png"
          alt="Vocalize"
          width={272}
          height={88}
          className="hidden dark:block"
          priority
        />
      </div>
      <style>{`
        @keyframes logo-breathe {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
        }
        .animate-logo-breathe {
          animation: logo-breathe 1.4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
