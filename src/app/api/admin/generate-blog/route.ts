import { NextRequest } from "next/server";
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

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const forcedTopic: string | null = body.topic || null;
    // dry_run = true: generate content only, skip saving to API and Telegram notification
    const isDryRun: boolean = body.dry_run === true;

    const enc = new TextEncoder();
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();

    const emit = (data: object) =>
        writer.write(enc.encode(`data: ${JSON.stringify(data)}\n\n`));

    (async () => {
        try {
            await emit({ type: "progress", step: "fetching", progress: 5, message: "Завантаження даних..." });

            const [posts, plan] = await Promise.all([getExistingPosts(), getContentPlan()]);

            await emit({ type: "progress", step: "searching", progress: 15, message: "Пошук актуальних даних..." });

            const [newsResults, lawResults] = await Promise.all([
                searchGoogle("ринок нерухомості України оренда квартир новини", 3),
                searchGoogle("закон оренда житло Україна зміни 2025", 2),
            ]);
            const generalSearchCtx = [
                formatSearchResults(newsResults, "НОВИНИ РИНКУ"),
                formatSearchResults(lawResults,  "ЗАКОНОДАВСТВО"),
            ].filter(Boolean).join("\n");

            await emit({ type: "progress", step: "planning", progress: 30, message: "Вибір теми..." });

            const { result: planning, tokens: planningTokens } = await planNextTopic(posts, plan, generalSearchCtx, forcedTopic);

            // Пошук саме під ті запити, які AI визначив як потрібні для ЦІЄЇ теми
            // (ціни міста, суми/назви програм допомоги, номери законів тощо) —
            // а не жорстко зашитий шаблон, який покривав тільки статті про міста.
            await emit({ type: "progress", step: "searching_topic", progress: 45, message: "Пошук фактів для теми..." });
            const topicSearchCtx = await runTargetedSearches(planning.search_queries ?? []);

            await emit({ type: "progress", step: "generating", progress: 60, message: "Генерація AI контенту..." });

            const { result: post, tokens: contentTokens } = await writePost(
                planning.selected_topic,
                planning.category,
                generalSearchCtx,
                topicSearchCtx,
            );

            const tokens = {
                input:  planningTokens.input + contentTokens.input,
                output: planningTokens.output + contentTokens.output,
            };

            if (isDryRun) {
                // Return generated content without saving — user fills the form manually
                await emit({
                    type: "done",
                    progress: 100,
                    post: {
                        title:    post.title,
                        excerpt:  post.excerpt,
                        content:  post.content,
                        category: post.category,
                        slug:     post.slug,
                    },
                    tokens,
                });
                return;
            }

            await emit({ type: "progress", step: "saving", progress: 85, message: "Збереження статті..." });

            await saveContentPlan({ items: planning.plan_updates, updatedAt: new Date().toISOString() });
            await publishDraft(post);

            await emit({ type: "progress", step: "notifying", progress: 95, message: "Telegram сповіщення..." });

            await sendDraftNotification({
                title:           post.title,
                excerpt:         post.excerpt,
                slug:            post.slug,
                selectionReason: planning.selection_reason,
                seoKeywords:     post.seo_keywords ?? [],
                planUpdated:     planning.plan_updates.filter((i) => i.status === "planned").length,
            });

            await emit({
                type:     "done",
                progress: 100,
                slug:     post.slug,
                topic:    planning.selected_topic,
                reason:   planning.selection_reason,
                tokens,
            });
        } catch (e) {
            await emit({ type: "error", message: String(e) });
        } finally {
            writer.close();
        }
    })();

    return new Response(readable, {
        headers: {
            "Content-Type":     "text/event-stream",
            "Cache-Control":    "no-cache",
            "X-Accel-Buffering": "no",
        },
    });
}
