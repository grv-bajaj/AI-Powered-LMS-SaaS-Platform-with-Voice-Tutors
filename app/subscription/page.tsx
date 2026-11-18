import {PricingTable} from "@clerk/nextjs";
import { Crown, Sparkles, Zap } from "lucide-react";

const Subscription = () => {
    return (
        <main className="subscription-page">
            <section className="subscription-hero">
                <div className="subscription-orb subscription-orb-one" aria-hidden="true" />
                <div className="subscription-orb subscription-orb-two" aria-hidden="true" />
                <div className="subscription-badge">
                    <Sparkles size={14} />
                    Choose your learning level
                </div>
                <div className="subscription-heading">
                    <div className="subscription-icon" aria-hidden="true">
                        <Crown size={28} />
                        <Zap className="subscription-icon-spark" size={13} />
                    </div>
                    <div>
                        <h1>Find Your Perfect Plan</h1>
                        <p>Unlock more conversations, companions, and learning possibilities.</p>
                    </div>
                </div>
            </section>
            <section className="subscription-table-wrap">
                <PricingTable />
            </section>
        </main>
    )
}
export default Subscription