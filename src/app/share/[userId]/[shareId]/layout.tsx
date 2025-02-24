import { Metadata } from 'next';

import { getUserByCustomUserId } from '../../../../lib/firestore';

interface ShareParams {
    userId: string;
    shareId: string;
}

export async function generateMetadata({
    params,
}: {
    params: ShareParams; // Promise 제거
}): Promise<Metadata> {
    try {
        const { userId, shareId } = await params;

        console.log('customUserId', userId, 'shareId', shareId);
        if (!userId) {
            throw new Error('CustomUserId is required');
        }

        const userData = await getUserByCustomUserId(userId);

        return {
            title: `${userData?.displayName || 'User'}'s Goopa Setup`,
            description: 'Check out my must-have Mac apps and setup!',
            openGraph: {
                title: `${userData?.displayName || 'User'}'s Goopa Setup`,
                description: 'Check out my must-have Mac apps and setup!',
                url: `https://goopa.nara.dev/share/${userId}/${shareId}`,
                siteName: 'Goopa',
                // OG 이미지 경로 수정 (동적 OG 이미지 사용)
                images: [
                    {
                        url: `/share/${userId}/${shareId}/opengraph-image`,
                        width: 1200,
                        height: 630,
                        alt: `${userData?.displayName || 'User'}'s Goopa Setup`,
                    },
                ],
                locale: 'en_US',
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${userData?.displayName || 'User'}'s Goopa Setup`,
                description: 'Check out my must-have Mac apps and setup!',

                images: [`/share/${userId}/${shareId}/opengraph-image`],
            },
        };
    } catch (error) {
        console.error('❌ Error generating metadata:', error);
        return {
            title: 'Goopa Setup',
            description: 'Check out this Mac setup!',
            // 에러 시 기본 OG 이미지 사용
            openGraph: {
                images: ['/opengraph-image.jpg'],
            },
            twitter: {
                images: ['/opengraph-image.jpg'],
            },
        };
    }
}

export default function ShareLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
