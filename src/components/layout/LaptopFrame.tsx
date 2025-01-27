import React from 'react';

export function LaptopFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full max-w-[960px] mx-auto">
            <div className="relative w-[150%] transform -translate-x-[16.67%]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    viewBox="0 0 640 480"
                    width="640"
                    height="480"
                    preserveAspectRatio="xMidYMid meet"
                    className="w-full h-auto"
                >
                    <linearGradient
                        id="SVGID_1_"
                        y2="352.25"
                        gradientUnits="userSpaceOnUse"
                        y1="116.71"
                        x2="487.74"
                        x1="147.44"
                    >
                        <stop stopColor="#999" offset="0" />
                        <stop stopColor="#4D4D4D" offset="1" />
                    </linearGradient>
                    <path
                        d="m161.82 352.71c-9.48 0-17.193 3.345-17.193-6.135v-216.11c0-9.48 7.713-17.191 17.193-17.191h316.27c9.479 0 17.19 7.711 17.19 17.191v216.11c0 9.48-7.711 6.135-17.19 6.135h-316.27z"
                        fill="url(#SVGID_1_)"
                    />
                    <linearGradient
                        id="SVGID_2_"
                        y2="195.63"
                        gradientUnits="userSpaceOnUse"
                        y1="282.9"
                        x2="154.16"
                        x1="491.5"
                    >
                        <stop stopColor="#999" offset="0" />
                        <stop stopColor="#666" offset="1" />
                    </linearGradient>
                    <path
                        d="m161.82 360.26c-7.545 0-13.682-6.137-13.682-13.681v-216.11c0-7.544 6.137-13.681 13.682-13.681h316.27c7.544 0 13.679 6.137 13.679 13.681v216.11c0 7.544-6.136 13.681-13.679 13.681h-316.27z"
                        fill="url(#SVGID_2_)"
                    />
                    <path d="m489.43 346.58c0 6.264-5.077 11.34-11.339 11.34h-316.27c-6.264 0-11.342-5.077-11.342-11.34v-216.11c0-6.264 5.078-11.341 11.342-11.341h316.27c6.262 0 11.339 5.077 11.339 11.341v216.11z" />
                    <linearGradient
                        id="SVGID_3_"
                        y2="347.67"
                        gradientUnits="userSpaceOnUse"
                        y1="362.89"
                        x2="555.44"
                        x1="85.97"
                    >
                        <stop stopColor="#666" offset="0" />
                        <stop stopColor="#636363" offset=".3031" />
                        <stop stopColor="#585858" offset=".5649" />
                        <stop stopColor="#464646" offset=".8107" />
                        <stop stopColor="#333" offset="1" />
                    </linearGradient>
                    <path
                        d="m557.2 355.44c0 3.996-12.265 7.234-16.943 7.234h-440.52c-4.679 0-16.943-3.238-16.943-7.234 0-3.992 3.792-7.228 8.471-7.228h457.46c4.68 0 8.47 3.24 8.47 7.23z"
                        fill="url(#SVGID_3_)"
                    />
                    <linearGradient
                        id="SVGID_4_"
                        y2="348.21"
                        gradientUnits="userSpaceOnUse"
                        y1="348.21"
                        x2="557.2"
                        x1="82.8"
                    >
                        <stop stopColor="#666" offset="0" />
                        <stop stopColor="#777" offset=".002" />
                        <stop stopColor="#999" offset=".0065" />
                        <stop stopColor="#B5B5B5" offset=".0114" />
                        <stop stopColor="#CBCBCB" offset=".0167" />
                        <stop stopColor="#DADADA" offset=".0224" />
                        <stop stopColor="#E3E3E3" offset=".0291" />
                        <stop stopColor="#E6E6E6" offset=".0388" />
                        <stop stopColor="#D4D4D4" offset=".0502" />
                        <stop stopColor="#BEBEBE" offset=".0684" />
                        <stop stopColor="#ADADAD" offset=".0899" />
                        <stop stopColor="#A2A2A2" offset=".1166" />
                        <stop stopColor="#9B9B9B" offset=".1539" />
                        <stop stopColor="#999" offset=".2577" />
                        <stop stopColor="#666" offset=".9444" />
                        <stop stopColor="#7A7A7A" offset=".9518" />
                        <stop stopColor="#AFAFAF" offset=".9668" />
                        <stop stopColor="#E6E6E6" offset=".9811" />
                        <stop stopColor="#333" offset="1" />
                    </linearGradient>
                    <rect
                        y="340.98"
                        x="82.8"
                        fill="url(#SVGID_4_)"
                        width="474.4"
                        height="14.464"
                    />
                    <rect
                        y="129.18"
                        x="159.04"
                        fill="#808080"
                        width="321.91"
                        height="194.85"
                    />
                    <path d="m534.22 348.41c0 0.524-0.786 0.951-1.758 0.951h-8.438c-0.972 0-1.757-0.427-1.757-0.951 0-0.526 0.785-0.949 1.757-0.949h8.438c0.97 0 1.76 0.42 1.76 0.95z" />
                    <path
                        d="m352.72 345.87h-65.431c-1.408 0-2.551-1.065-2.551-2.378v-2.38h70.532v2.38c0 1.31-1.15 2.38-2.55 2.38z"
                        fill="#3E3D3D"
                    />
                </svg>

                {/* Screen Content */}
                <div className="absolute top-[26.9%] left-[24.85%] w-[50.3%] h-[40.6%] overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
