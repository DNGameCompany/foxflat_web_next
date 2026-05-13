// app/blog/[slug]/page.tsx — SSR
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPost from "./BlogPost.client";
import BlogSidebar from "./BlogSidebar";
import HeaderFoxFlat from "@/src/components/HeaderFoxFlat";
import FooterFoxFlat from "@/src/components/FooterFoxFlat";

export const revalidate = 3600;

export interface PostFull {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: "tips" | "news" | "guide";
    created_at: string;
    read_time: number;
    cover_image?: string;
}

async function getPost(slug: string): Promise<PostFull | null> {
    try {
        const res = await fetch(
            `https://api.foxflat.com.ua/blog/posts/${slug}`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};
    return {
        title: `${post.title} — FoxFlat Blog`,
        description: post.excerpt,
        alternates: { canonical: `https://foxflat.com.ua/blog/${post.slug}` },
        robots: { index: true, follow: true },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://foxflat.com.ua/blog/${post.slug}`,
            siteName: 'FoxFlat',
            locale: 'uk_UA',
            type: 'article',
            ...(post.cover_image ? { images: [{ url: post.cover_image, width: 1200, height: 630 }] } : {}),
        },
    };
}

export default async function BlogPostPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) notFound();

    return (
        <>
            <HeaderFoxFlat />
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-5xl mx-auto px-4 py-14">
                    <div className="flex gap-12 items-start">

                        {/* Основний контент */}
                        <div className="flex-1 min-w-0">
                            <BlogPost post={post} />
                        </div>

                        {/* Сайдбар */}
                        <div className="hidden lg:block sticky top-8">
                            <BlogSidebar currentSlug={slug} />
                        </div>

                    </div>
                </div>
            </div>
            <FooterFoxFlat />
        </>
    );
}