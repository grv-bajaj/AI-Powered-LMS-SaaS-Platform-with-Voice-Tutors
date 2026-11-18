"use client";

import { toggleBookmark } from "@/lib/actions/companion.actions";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Clock3, Play } from "lucide-react";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isUpdatingBookmark, setIsUpdatingBookmark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleBookmark = async () => {
    setIsUpdatingBookmark(true);

    try {
      await toggleBookmark(id, isBookmarked, pathname);
      setIsBookmarked((current) => !current);
      router.refresh();
    } catch (error) {
      console.error("Failed to update bookmark", error);
    } finally {
      setIsUpdatingBookmark(false);
    }
  };
  
  return (
    <article className="companion-card" style={{ backgroundColor: color }}>
      <div className="flex justify-between items-center">
        <div className="subject-badge">{subject}</div>
        <button
          type="button"
          className="companion-bookmark"
          onClick={handleBookmark}
          disabled={isUpdatingBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked
            ? <BookmarkCheck size={14} strokeWidth={2.4} />
            : <Bookmark size={14} strokeWidth={2.4} />}
        </button>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <p className="text-sm">{topic}</p>
      <div className="flex items-center gap-2">
        <Clock3 size={14} />
        <p className="text-sm">{duration} minutes</p>
      </div>

      <Link href={`/companions/${id}`} className="w-full">
        <button className="btn-primary w-full justify-center">
          <Play size={14} fill="currentColor" />
          Launch Lesson
        </button>
      </Link>
    </article>
  );
};

export default CompanionCard;