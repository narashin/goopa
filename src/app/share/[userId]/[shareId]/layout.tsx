import { Metadata } from 'next';

import { getUserByCustomUserId } from '../../../../lib/firestore';

type ShareParams = Promise<{
    customUserId: string;
    shareId: string;
}>;

export async function generateMetadata(props: {
    params: ShareParams;
}): Promise<Metadata> {
    try {
        const { customUserId, shareId } = await props.params;
        const userData = await getUserByCustomUserId(customUserId);

        return {
            title: `${userData?.displayName || 'User'}'s Goopa Setup`,
            description: 'Check out my must-have Mac apps and setup!',
            openGraph: {
                title: `${userData?.displayName || 'User'}'s Goopa Setup`,
                description: 'Check out my must-have Mac apps and setup!',
                url: `https://goopa.nara.dev/share/${customUserId}/${shareId}`,
                siteName: 'Goopa',
                images: [
                    {
                        url: `https://goopa.nara.dev/api/og?userId=${customUserId}`,
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
                images: [
                    `https://goopa.nara.dev/api/og?userId=${customUserId}`,
                ],
            },
        };
    } catch (error) {
        console.error('❌ Error generating metadata:', error);
        return {
            title: 'Goopa Setup',
            description: 'Check out this Mac setup!',
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
