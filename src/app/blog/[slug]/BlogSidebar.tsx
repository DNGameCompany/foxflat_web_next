// app/blog/[slug]/BlogSidebar.tsx
import Link from "next/link";

const CATEGORY_CONFIG = {
    tips:  { label: "Поради",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    guide: { label: "Гайд",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
} as const;

type Category = keyof typeof CATEGORY_CONFIG;

interface SidebarPost {
    slug: string;
    title: string;
    category: Category;
    created_at: string;
    read_time: number;
    cover_image?: string;
}

async function getLatestPosts(excludeSlug: string): Promise<SidebarPost[]> {
    try {
        const res = await fetch(
            `https://api.foxflat.com.ua/blog/posts?published=true&limit=6`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return [];
        const posts: SidebarPost[] = await res.json();
        return posts.filter((p) => p.slug !== excludeSlug).slice(0, 5);
    } catch {
        return [];
    }
}

export default async function BlogSidebar({ currentSlug }: { currentSlug: string }) {
    const posts = await getLatestPosts(currentSlug);

    if (posts.length === 0) return null;

    return (
        <aside className="w-64 shrink-0 space-y-3">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/25 uppercase mb-4">
                Останні статті
            </p>

            {posts.map((post) => {
                const cat = CATEGORY_CONFIG[post.category];
                return (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-orange-500/25 hover:bg-orange-500/[0.03] transition-all duration-200"
                    >
                        {/* Мініатюра або placeholder */}
                        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white/[0.04]">
                            {post.cover_image ? (
                                <img
                                    src={post.cover_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-transparent">
                                    <span className="text-orange-500/30 text-lg font-black"
                                          style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                        {post.title[0]}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Текст */}
                        <div className="flex flex-col gap-1.5 min-w-0">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border w-fit ${cat?.color}`}>
                                {cat?.label}
                            </span>
                            <p className="text-xs font-semibold text-white/60 group-hover:text-white/90 transition-colors leading-snug line-clamp-2"
                               style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "11px" }}>
                                {post.title}
                            </p>
                            <span className="text-[10px] text-white/20">{post.read_time} хв</span>
                        </div>
                    </Link>
                );
            })}
        </aside>
    );
}