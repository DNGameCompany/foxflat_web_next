import { NextRequest, NextResponse } from "next/server";
import {
    searchGoogle,
    formatSearchResults,
    extractCity,
    getContentPlan,
    saveContentPlan,
    getExistingPosts,
    planNextTopic,
    writePost,
    publishDraft,
    sendDraftNotification,
} from "@/lib/blogGeneration";

export async function GET(req: NextRequest) {
    if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

        const { result: planning } = await planNextTopic(posts, plan, generalSearchCtx, null);

        // Прицільний пошук САМЕ під обране місто — щоб ціни/райони в статті
        // бралися зі свіжих даних, а не з (можливо застарілої) пам'яті моделі.
        const city = extractCity(planning.selected_topic);
        const [priceResults, districtResults] = city
            ? await Promise.all([
                searchGoogle(`ціни оренди квартир ${city} 2026`, 3),
                searchGoogle(`райони ${city} оренда квартир де краще жити`, 3),
            ])
            : [[], []];
        const citySearchCtx = [
            formatSearchResults(priceResults,    "ЦІНИ"),
            formatSearchResults(districtResults, "РАЙОНИ"),
        ].filter(Boolean).join("\n");

        const { result: post } = await writePost(
            planning.selected_topic,
            planning.category,
            generalSearchCtx,
            citySearchCtx,
        );

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

        return NextResponse.json({
            ok:    true,
            slug:  post.slug,
            topic: planning.selected_topic,
        });
    } catch (e) {
        console.error("Cron error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
