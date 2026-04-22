import type { MetadataRoute } from 'next'
import { getGenerals, getTactics, getTeams } from '@/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sanmou-wiki.vercel.app'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [
        generals,
        tactics,
        teams,
    ] = await Promise.all([
        getGenerals(),
        getTactics(),
        getTeams(),
    ])

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/generals`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/tactics`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/buffs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/stats`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/info`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/builder`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/admin_join_team`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    const generalPages: MetadataRoute.Sitemap = generals.map((general) => ({
        url: `${BASE_URL}/generals/${general.name}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const tacticPages: MetadataRoute.Sitemap = tactics.map((tactic) => ({
        url: `${BASE_URL}/tactics/${tactic.name}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        ...staticPages,
        ...generalPages,
        ...tacticPages,
    ]
}