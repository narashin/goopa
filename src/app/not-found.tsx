import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex-1 p-4 h-full">
            <div className="h-full flex flex-col items-center justify-between bg-[#C5C6BD] text-white font-sans p-2 rounded-3xl overflow-hidden min-h-full">
                <div className="text-center w-full max-w-2xl mx-auto relative flex flex-col min-h-full justify-between py-4">
                    <div className="relative z-10">
                        <h1 className="text-xl font-bold mb-4 text-[#1a1b26]">
                            Page Not Found
                        </h1>
                        <p className="text-base mb-8 text-[#1a1b26]/80">
                            {
                                "Sorry, we couldn't find the page you're looking for."
                            }
                        </p>
                    </div>

                    <div className="relative w-full h-24">
                        <Image
                            src="/images/goopa-disappearing.PNG"
                            alt="GOOPA disappearing"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="relative mt-6 z-10">
                        <Link
                            href="/"
                            className="px-3 py-1 bg-[#1a1b26] text-white rounded-lg hover:bg-[#1a1b26]/90 transition-colors duration-300 inline-flex items-center"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
