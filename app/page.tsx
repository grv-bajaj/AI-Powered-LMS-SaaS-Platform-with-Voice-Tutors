import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import {getAllCompanions, getUserSessions} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const Page = async () => {
  const [{ userId }, companions] = await Promise.all([
    auth(),
    getAllCompanions({ limit: 3 }),
  ]);
  const recentSessionsCompanions = userId
    ? await getUserSessions(userId, 10)
    : [];

  return (
    <main>
      <h1>Popular Companions</h1>
      <section className='home-section'>
        {companions.map((companion) => (
          <CompanionCard
            key={`${companion.id}-${companion.bookmarked}`}
            {...companion}
            color={getSubjectColor(companion.subject)}
          />
        ))}
      </section>

      <section className='home-section'>
        {recentSessionsCompanions.length > 0 ? (
          <CompanionsList
            title="Recently completed sessions"
            companions={recentSessionsCompanions}
            classNames="w-2/3 max-lg:w-full"
          />
        ) : (
          <section className="companion-list flex w-2/3 flex-col items-center justify-center gap-4 py-10 text-center max-lg:w-full">
            <Image
              src="/images/cta.svg"
              alt="Start your learning journey"
              width={220}
              height={140}
            />
            <h2 className="text-2xl font-bold">Your learning journey starts here</h2>
            <p className="max-w-md text-muted-foreground">
              No sessions yet. Choose a companion above and start your first lesson.
            </p>
            <Link href="/companions" className="btn-primary">
              Explore companions
            </Link>
          </section>
        )}
        <CTA />
      </section>
    </main>
  )
}

export default Page