'use server';

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";
import { cacheLife, cacheTag, revalidatePath, revalidateTag } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .insert({...formData, author })
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    revalidateTag("companions", "max");
    revalidatePath("/companions", "page");
    revalidatePath("/", "page");

    return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    let query = supabase.from('companions').select();

    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if(error) throw new Error(error.message);

    if (!userId) {
        return companions.map((companion) => ({ ...companion, bookmarked: false }));
    }

    if (companions.length === 0) {
        return [];
    }

    const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('companion_id')
        .eq('user_id', userId)
        .in('companion_id', companions.map((companion) => companion.id));

    if (bookmarksError) throw new Error(bookmarksError.message);

    const bookmarkedIds = new Set(bookmarks.map(({ companion_id }) => companion_id));

    return companions.map((companion) => ({
        ...companion,
        bookmarked: bookmarkedIds.has(companion.id),
    }));
}

export const getCompanion = async (id: string) => {
    "use cache";
    cacheLife("hours");
    cacheTag(`companion-${id}`);

    const supabase = createSupabaseClient(false);

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if(error) return console.log(error);

    return data[0];
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error('You must be signed in to save session history');
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const canStartSession = async () => {
    const { userId, has } = await auth();

    if (!userId) {
        return { allowed: false, limit: 0, used: 0 };
    }

    if (!has({ plan: 'basic' })) {
        return { allowed: true, limit: null, used: 0 };
    }

    const limit = 10;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const supabase = createSupabaseClient();
    const { count, error } = await supabase
        .from('session_history')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

    if (error) throw new Error(error.message);

    const used = count ?? 0;
    return { allowed: used < limit, limit, used };
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`id, companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ id: sessionId, companions }) => ({
        ...companions,
        sessionId,
    }));
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`id, companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ id: sessionId, companions }) => ({
        ...companions,
        sessionId,
    }));
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();

    let limit = 0;

    if(has({ plan: 'pro' })) {
        return true;
    } else if(has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    if(companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();

  const { data: existing, error: existingError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("companion_id", companionId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }
  if (existing) {
    revalidatePath(path);
    revalidatePath("/", "page");
    revalidatePath("/companions", "page");
    return existing;
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .upsert(
      { companion_id: companionId, user_id: userId },
      { onConflict: "user_id,companion_id", ignoreDuplicates: true },
    )
    .select();
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path);
  revalidatePath("/", "page");
  revalidatePath("/companions", "page");
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  revalidatePath("/", "page");
  revalidatePath("/companions", "page");
  return data;
};

export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`id, companion_id, companions:companion_id (*)`)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }

  const uniqueBookmarks = new Map<
    string,
    { companion: Companion; bookmarkId: number | string }
  >();
  const duplicateBookmarkIds: (number | string)[] = [];

  for (const row of data) {
    if (!row.companions) continue;

    const existing = uniqueBookmarks.has(row.companion_id);
    if (existing) {
      duplicateBookmarkIds.push(row.id);
      continue;
    }

    uniqueBookmarks.set(row.companion_id, {
      companion: row.companions as Companion,
      bookmarkId: row.id,
    });
  }

  if (duplicateBookmarkIds.length > 0) {
    const { error: cleanupError } = await supabase
      .from("bookmarks")
      .delete()
      .in("id", duplicateBookmarkIds);

    if (cleanupError) {
      console.error("Failed to remove duplicate bookmarks", cleanupError);
    }
  }

  return [...uniqueBookmarks.values()].map(({ companion }) => companion);
};