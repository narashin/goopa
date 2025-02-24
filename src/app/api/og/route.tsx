import React from 'react';

import { ImageResponse } from 'next/og';

import { getUserByCustomUserId } from '../../../lib/firestore';

export const runtime = 'edge';
export const contentType = 'image/png';

interface RouteParams {
    params: { userId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const userData = await getUserByCustomUserId(params.userId);

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
                            src="/images/goopa-logo.png"
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
        console.error('❌ Error generating image:', error);
        return new Response('Failed to generate image', { status: 500 });
    }
}
