"use client";

import { useAuth } from "@clerk/nextjs";
import { Crown, Sparkles, Star } from "lucide-react";
import Link from "next/link";

const SubscriptionBadge = () => {
  const { has, isLoaded } = useAuth();

  if (!isLoaded) return null;

  const plan = has?.({ plan: "pro" })
    ? {
        name: "Pro Companion",
        icon: Crown,
        className: "border-amber-400/60 bg-amber-50 text-amber-700 hover:bg-amber-100",
      }
    : has?.({ plan: "core" })
      ? {
          name: "Core Learner",
          icon: Sparkles,
          className: "border-violet-400/60 bg-violet-50 text-violet-700 hover:bg-violet-100",
        }
      : has?.({ plan: "basic" })
        ? {
            name: "Basic Plan",
            icon: Star,
            className: "border-sky-400/60 bg-sky-50 text-sky-700 hover:bg-sky-100",
          }
        : {
            name: "Unknown Plan",
            icon: Star,
            className: "border-gray-400/60 bg-gray-50 text-gray-700 hover:bg-gray-100",
          };
  const PlanIcon = plan.icon;

  return (
    <Link
      href="/subscription"
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors max-sm:px-2 ${plan.className}`}
      aria-label={`Current subscription: ${plan.name}. Manage subscription`}
    >
      <PlanIcon size={15} strokeWidth={2.2} />
      <span className="max-sm:hidden">{plan.name}</span>
    </Link>
  );
};

export default SubscriptionBadge;
