import Image from "next/image";

export default function Loading() {
  return (
    <main
      className="flex min-h-[calc(100vh-80px)] items-center justify-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex items-center justify-center">
        <div className="animate-logo-breathe" role="status" aria-label="Loading">
          <Image
            src="/images/icon.png"
            alt="Vocalize"
            width={272}
            height={88}
            priority
          />
        </div>
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
