import React from 'react';

// src/app/share/[customUserId]/[shareId]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

import { getUserByCustomUserId } from '../../../../lib/firestore';

export const runtime = 'edge';

export default async function Image({
    params,
}: {
    params: { customUserId: string; shareId: string };
}) {
    try {
        const userData = await getUserByCustomUserId(params.customUserId);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#E5E5E5',
                        padding: '60px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goopa-logo-rCfpDwRO4YdP0vk5K1NrND8IIAjWih.png"
                            alt="Goopa Logo"
                            style={{
                                width: '400px',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            marginTop: '40px',
                        }}
                    >
                        <div
                            style={{
                                color: '#1a1a1a',
                                fontSize: '48px',
                                fontWeight: 700,
                                textAlign: 'center',
                            }}
                        >
                            {userData?.displayName || 'User'}`&apos;`s Goopa
                        </div>

                        <div
                            style={{
                                color: '#666666',
                                fontSize: '24px',
                            }}
                        >
                            goopa.nara.dev
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error('OG Image generation error:', error);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#E5E5E5',
                        padding: '40px',
                    }}
                >
                    <div
                        style={{
                            color: '#EF4444',
                            fontSize: '24px',
                            marginBottom: '20px',
                        }}
                    >
                        Failed to generate image
                    </div>
                    <div
                        style={{
                            color: '#666666',
                            fontSize: '16px',
                            textAlign: 'center',
                        }}
                    >
                        {error instanceof Error
                            ? error.message
                            : 'Unknown error occurred'}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    }
}
