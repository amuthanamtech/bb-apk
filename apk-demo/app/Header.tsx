'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';


const Header = () => {
    // Auto-cleanup search state based on URL (homepage navigation, no query params, etc.)

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const router = useRouter();

    // Use centralized authentication state

    // Debug: Log auth state in Header (development only)

    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [verifiedData, setVerifiedData] = useState<{
        phone?: string;
        email?: string;
        token?: string;
    }>({});

    // Categories data for mobile menu (reuse DynamicMenu store)

    // Close mobile menu when route changes (App Router)
    const pathname = usePathname();
    useEffect(() => {
        setIsMenuOpen(false);
        setIsSearchExpanded(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open - improved implementation
    useEffect(() => {
        if (isMenuOpen) {
            // Save original scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            // Cleanup on unmount
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isMenuOpen]);

    // Handle search expansion on mobile
    const handleSearchToggle = () => {
        setIsSearchExpanded(!isSearchExpanded);
    };



    const quickActions = [
        {
            name: 'Favorites',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            path: '/favorites'
        },
        {
            name: 'My Ads',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            path: '/myads'
        },
        {
            name: 'Messages',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            path: '/chat-v2'
        },
        {
            name: 'Alerts',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            path: '/notifications'
        }
    ];



    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-50">
                {/* Main Header Bar */}
                <div className="bg-gradient-to-r from-dynamic to-dynamic1">
                    <div className="w-full max-w-screen mx-auto">
                        <div className="max-w-screen mx-auto">
                            {/* Mobile Search Expanded State - Full Width */}
                            {isSearchExpanded && (
                                <div className="md:hidden bg-gradient-to-r from-dynamic to-dynamic1 px-3 py-3 border-b border-white/20">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsSearchExpanded(false)}
                                            className="flex-shrink-0 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                                            aria-label="Close search"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <div className="flex-1">
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Header Content */}
                            <div className={`px-3 py-3 ${isSearchExpanded ? 'hidden' : 'block'}`}>
                                <div className="flex items-center justify-between">
                                    {/* Left: Hamburger & Logo */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* Mobile Hamburger */}
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="md:hidden p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                                            aria-label="Toggle menu"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                {isMenuOpen ? (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                ) : (
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                )}
                                            </svg>
                                        </button>

                                        {/* Logo */}
                                        <div className="scale-90 md:scale-100 cursor-pointer" onClick={() => router.push('/')}>
                                        </div>
                                    </div>

                                    {/* Desktop: Search & Location */}
                                    <div className="hidden lg:flex items-center gap-3 flex-1 max-w-7xl mx-8">
                                        {/* Location Selector */}
                                        <div className="flex items-center flex-shrink-0">

                                        </div>

                                        {/* Search Bar */}
                                        <div className="flex items-center flex-1">
                                            <div className="w-full">

                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Right Section */}
                                    <div className="hidden md:flex items-center gap-3 flex-shrink-0 relative z-50">



                                        <button
                                            onClick={() => router.push('/ad/post')}
                                            className="relative z-50 bg-white text-purple-600 border border-dynamic h-[40px] px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out shadow-sm hover:shadow-md hover:bg-gradient-to-r from-dynamic to-dynamic1 hover:text-white flex items-center gap-2"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            Post Ad
                                        </button>
                                    </div>


                                    {/* Mobile Action Icons */}
                                    <div className="flex md:hidden items-center gap-2">

                                        {/* Post Ad Icon */}
                                        <button
                                            onClick={() => router.push('/ad/post')}
                                            className="p-2 bg-white text-dynamic rounded-md hover:bg-dynamic hover:text-white transition-all duration-200 shadow-sm"
                                            aria-label="Post ad"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Search Bar - Always Visible (Collapsed State) */}
                                <div className="md:hidden mt-3">
                                    <div
                                        onClick={handleSearchToggle}
                                        className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 text-white/80">
                                            <svg className="w-5 h-5 mx-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <span className="text-sm font-medium">Search for cars, phones, jobs...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Mobile Menu */}
                <div
                    className={`fixed top-0 left-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex flex-col h-full">
                        {/* Header with User Info */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-dynamic to-dynamic1">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto pb-20">
                            {/* Search in Mobile Menu */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="mb-3">

                                </div>
                            </div>

                            {/* Categories Section */}
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Browse Categories</h3>
                            </div>

                            {/* Account & Support Links */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Account</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            router.push('/help');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors flex items-center gap-3"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Help & Support
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Bottom Post Ad Button */}
                        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 shadow-lg">
                            <button
                                onClick={() => {
                                    router.push('/ad/post');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full mb-20 bg-gradient-to-r from-dynamic to-dynamic1 hover:from-dynamic/90 hover:to-dynamic1/90 text-white py-4 px-4 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Post Free Ad
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile menu */}
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fadeIn"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Desktop Categories Bar */}
                <div className="hidden md:block bg-white border-t border-gray-100">
                    <div className="max-w-screen-xl mx-auto">
                    </div>
                </div>
            </header>

            <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
        </>
    );
};

export default Header;