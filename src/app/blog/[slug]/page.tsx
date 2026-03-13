// app/blog/[slug]/page.tsx — SSR
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPost from "@/src/app/blog/[slug]/ClientBlogPost";

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
            `${process.env.NEXT_PUBLIC_API_URL}/blog/posts/${slug}`,
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
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `https://foxflat.com.ua/blog/${post.slug}`,
            ...(post.cover_image ? { images: [post.cover_image] } : {}),
        },
    };
}

export default async function BlogPostPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) notFound();
    return <BlogPost post={post} />;
}