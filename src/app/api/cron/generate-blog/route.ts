import { NextRequest, NextResponse } from "next/server";
import {
    searchGoogle,
    formatSearchResults,
    runTargetedSearches,
    getContentPlan,
    saveContentPlan,
    getExistingPosts,
    planNextTopic,
    writePost,
    publishDraft,
    sendDraftNotification,
} from "@/lib/blogGeneration";

// Більше пошукових запитів + довша генерація (до 7000 токенів) можуть не вкластись
// у дефолтний таймаут serverless-функції. 300с — максимум на Vercel Pro для cron;
// на Hobby максимум 60с — якщо ви на Hobby, зменшіть MAX_QUERIES_PER_ARTICLE в ai.ts,
// інакше функція обірветься по таймауту й стаття не опублікується.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
    if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = { planning: { input: 0, output: 0 }, writing: { input: 0, output: 0 } };

    try {
        const [posts, plan] = await Promise.all([
            getExistingPosts(),
            getContentPlan(),
        ]);

        const [newsResults, lawResults] = await Promise.all([
            searchGoogle("ринок нерухомості України оренда квартир новини", 3),
            searchGoogle("закон оренда житло Україна зміни 2025", 2),
        ]);
        const generalSearchCtx = [
            formatSearchResults(newsResults, "НОВИНИ РИНКУ"),
            formatSearchResults(lawResults,  "ЗАКОНОДАВСТВО"),
        ].filter(Boolean).join("\n");

        const { result: planning, tokens: planningTokens } = await planNextTopic(posts, plan, generalSearchCtx, null);
        usage.planning = planningTokens;

        // Пошук саме під ті запити, які AI визначив як потрібні для ЦІЄЇ теми,
        // згруповані по категоріях (ціни/статистика, конкуренти в топі, законодавство,
        // новини, експертні думки, локальні дані) — до 8 запитів × 5 результатів.
        const topicSearchCtx = await runTargetedSearches(planning.search_queries ?? []);

        const { result: post, tokens: writingTokens } = await writePost(
            planning.selected_topic,
            planning.category,
            generalSearchCtx,
            topicSearchCtx,
        );
        usage.writing = writingTokens;

        await saveContentPlan({ items: planning.plan_updates, updatedAt: new Date().toISOString() });

        // TODO: генерація зображення через Imagen API (потребує підключеного білінгу в Google Cloud)
        // const coverImage = await generateCoverImage(post.title, post.category, post.seo_keywords ?? []);

        await publishDraft(post);

        await sendDraftNotification({
            title:           post.title,
            excerpt:         post.excerpt,
            slug:            post.slug,
            selectionReason: planning.selection_reason,
            seoKeywords:     post.seo_keywords ?? [],
            planUpdated:     planning.plan_updates.filter((i) => i.status === "planned").length,
        });

        const totalTokens = {
            input:  usage.planning.input + usage.writing.input,
            output: usage.planning.output + usage.writing.output,
        };
        console.log("Blog gen tokens:", { ...usage, total: totalTokens });

        return NextResponse.json({
            ok:            true,
            slug:          post.slug,
            topic:         planning.selected_topic,
            search_queries: (planning.search_queries ?? []).map((q) => `[${q.category}] ${q.query}`),
            tokens:        totalTokens,
        });
    } catch (e) {
        console.error("Cron error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}