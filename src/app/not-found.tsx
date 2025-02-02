import React from 'react';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-600 mb-4">
                    페이지를 찾을 수 없습니다
                </h2>
                <p className="text-xl text-gray-500 mb-8">
                    죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
                </p>
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
