'use client';

import { useState, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import VideoPlayer from '@/components/VideoPlayer';
import { VideoInfo } from '@/lib/telegram';

export default function Home() {
    const [videos, setVideos] = useState<VideoInfo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState(true);

    // 获取真实视频列表
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/videos');
                const data = await response.json();
                if (data.videos) {
                    setVideos(data.videos);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center bg-black text-white px-4 py-12 lg:px-24">
            <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm">
                <header className="flex flex-col items-start gap-2 mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
                        Telegram Video Gallery
                    </h1>
                    <p className="text-gray-400 text-base">
                        直接在浏览器中浏览并播放来自 Telegram 群组的视频资源。
                    </p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <VideoCard
                                key={video.uniqueId}
                                video={video}
                                onClick={setSelectedVideo}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center justify-center py-32 border border-gray-800 border-dashed rounded-3xl bg-gray-900/20">
                        <div className="p-4 bg-gray-800/50 rounded-full mb-6 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 4.515 8.75h14.97c.563 0 1.04.417 1.112.977ZM9 10.5v1.875a1.125 1.125 0 1 0 2.25 0V10.5m3.75 0v1.875a1.125 1.125 0 1 0 2.25 0V10.5" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-gray-200">库中还没有视频</h2>
                        <p className="text-gray-500 mt-2 max-w-md text-center">
                            请向您的 Bot 发送视频文件，或将 Bot 添加到群组中。视频将自动出现在这里。
                        </p>
                    </div>
                )}
            </div>

            {selectedVideo && (
                <VideoPlayer
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}

            <footer className="mt-auto pt-24 pb-8 text-gray-600 text-xs">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-px w-24 bg-gray-800 mb-4"></div>
                    <p>&copy; 2024 Telegram H5 Gallery. Powerd by Next.js & Telegram API.</p>
                </div>
            </footer>
        </main>
    );
}
