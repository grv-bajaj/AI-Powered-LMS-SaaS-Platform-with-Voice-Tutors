import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

const CTA = () => {
    return (
        <section className="cta-section">
            <div className="cta-badge flex items-center gap-1.5">
                <Sparkles size={13} />
                Start learning your way.
            </div>
            <h2 className="text-3xl font-bold">
                Build and Personalize Learning Companion
            </h2>
            <p>Pick a name, subject, voice, & personality — and start learning through voice conversations that feel natural and fun.</p>
            <Image src="/images/cta.svg" alt="cta" width={362} height={232} />
            <Link href="/companions/new" className="btn-primary">
                <Plus size={14} strokeWidth={2.5}/>
                <span>Build a New Companion</span>
            </Link>
        </section>
    )
}
export default CTA