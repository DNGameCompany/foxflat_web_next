// app/blog/page.tsx

import type { Metadata } from "next";
import BlogList from "@/src/app/blog/BlogList.client";
import HeaderFoxFlat from "@/src/components/HeaderFoxFlat";
import FooterFoxFlat from "@/src/components/FooterFoxFlat"; // твій правильний шлях

export const metadata: Metadata = {
    title: "Блог FoxFlat — поради з оренди квартир в Україні",
    description: "Корисні статті, поради та гайди про оренду квартир в Україні. Як знайти квартиру швидко, на що звертати увагу, як не переплатити.",
    alternates: { canonical: 'https://foxflat.com.ua/blog' },
    robots: { index: true, follow: true },
    openGraph: {
        title: "Блог FoxFlat — поради з оренди квартир",
        description: "Корисні статті про пошук житла в Україні",
        url: "https://foxflat.com.ua/blog",
        images: [{ url: "https://foxflat.com.ua/og-image.png", width: 1200, height: 630, alt: "FoxFlat Blog" }],
    },
};

export const revalidate = 300; // 5 хвилин — оптимально для блогу на старті

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
        const url = "https://api.foxflat.com.ua/blog/posts?published=true";
        const res = await fetch(url, {
            next: {
                revalidate: 300,          // синхронізуй з export const revalidate
                tags: ["blog-posts"]      // для майбутньої on-demand інвалідації
            }
        });

        if (!res.ok) {
            console.error("API помилка:", res.status);
            return [];
        }

        return res.json();
    } catch (err) {
        console.error("Помилка fetch постів:", err);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getPosts();
    return (
        <>
            <HeaderFoxFlat />
            <BlogList posts={posts} />
            <FooterFoxFlat />
        </>
    );
}