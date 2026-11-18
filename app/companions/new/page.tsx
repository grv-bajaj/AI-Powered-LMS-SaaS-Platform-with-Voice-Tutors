import CompanionForm from "@/components/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { Bot, ShieldCheck, Sparkles } from "lucide-react";

const NewCompanion = async () => {
    const { userId } = await auth();
    if(!userId) redirect('/sign-in');

    const canCreateCompanion = await newCompanionPermissions();

    return (
        <main className="items-center justify-center py-10 max-md:py-6">
            {canCreateCompanion ? (
                <div className="companion-builder-shell w-full max-w-3xl">
                    <div className="companion-builder-glow" aria-hidden="true" />
                    <article className="companion-builder-card">
                        <div className="companion-builder-header">
                            <div className="companion-builder-icon">
                                <Bot size={30} strokeWidth={1.8} />
                                <Sparkles className="companion-builder-sparkle" size={14} />
                            </div>
                            <div>
                                <div className="companion-builder-eyebrow">
                                    <ShieldCheck size={14} />
                                    Personalized AI tutor
                                </div>
                                <h1>Build Your Companion</h1>
                                <p>Choose a subject, teaching style, and voice to create a tutor made for you.</p>
                            </div>
                        </div>
                        <CompanionForm />
                    </article>
                </div>
                ) : (
                    <article className="companion-limit">
                        <Image src="/images/limit.svg" alt="Companion limit reached" width={360} height={230} />
                        <div className="cta-badge">
                            Upgrade your plan
                        </div>
                        <h1>You’ve Reached Your Limit</h1>
                        <p>You’ve reached your companion limit. Upgrade to create more companions and premium features.</p>
                        <Link href="/subscription" className="btn-primary w-full justify-center" >
                            Upgrade My Plan
                        </Link>
                    </article>
                )}
        </main>
    )
}

export default NewCompanion