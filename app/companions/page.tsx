import {getAllCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";
import Link from "next/link";
import { Library, Plus } from "lucide-react";

const CompanionsLibrary = async ({ searchParams }: SearchParams) => {
    const filters = await searchParams;
    const subject = filters.subject ? filters.subject : '';
    const topic = filters.topic ? filters.topic : '';

    const companions = await getAllCompanions({ subject, topic });

    return (
        <main>
            <section className="flex justify-between gap-4 max-sm:flex-col">
                <div className="flex items-center justify-between gap-4 max-sm:w-full">
                    <div className="page-heading compact">
                        <div className="page-heading-icon"><Library size={18} /></div>
                        <h1>Companion Library</h1>
                    </div>
                    <Link href="/companions/new" className="btn-primary whitespace-nowrap">
                        <Plus size={14} strokeWidth={2.5} />
                        <span className="max-sm:hidden">Build a Companion</span>
                        <span className="sm:hidden">Build</span>
                    </Link>
                </div>
                <div className="flex gap-4">
                    <SearchInput />
                    <SubjectFilter />
                </div>
            </section>
            <section className="companions-grid">
                {companions.map((companion) => (
                    <CompanionCard
                        key={`${companion.id}-${companion.bookmarked}`}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                    />
                ))}
            </section>
        </main>
    )
}

export default CompanionsLibrary