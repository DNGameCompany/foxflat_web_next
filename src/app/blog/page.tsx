import type { Metadata } from "next";
import BlogList from "@/src/app/blog/ClientBlogList";

export const metadata: Metadata = {
    title: "Блог FoxFlat — поради з оренди квартир в Україні",
    description: "Корисні статті, поради та гайди про оренду квартир в Україні. Як знайти квартиру швидко, на що звертати увагу, як не переплатити.",
    openGraph: {
        title: "Блог FoxFlat — поради з оренди квартир",
        description: "Корисні статті про пошук житла в Україні",
        url: "https://foxflat.com.ua/blog",
    },
};

export const revalidate = 3600;

export type Category = "tips" | "news" | "guide";

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: Category;
    created_at: string;
    read_time: number;
    cover_image?: string;
}

async function getPosts(): Promise<Post[]> {
    try {
        const res = await fetch(
            `https://api.foxflat.com.ua/blog/posts?published=true`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getPosts();
    return <BlogList posts={posts} />;
}