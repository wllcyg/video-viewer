'use client';

import { VideoInfo } from '@/lib/telegram';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface VideoPlayerProps {
    video: VideoInfo;
    onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
    // 视频流通过我们的代理接口获取
    const videoUrl = `/api/video/${video.fileId}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-300">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-50"
            >
                <XMarkIcon className="w-8 h-8" />
            </button>

            <div className="w-full max-w-4xl px-4">
                <video
                    controls
                    autoPlay
                    className="w-full aspect-video rounded-lg shadow-2xl bg-black"
                    src={videoUrl}
                >
                    您的浏览器不支持 HTML5 视频播放。
                </video>

                <div className="mt-6 text-left">
                    <h2 className="text-xl font-semibold text-white">
                        {video.fileName || video.caption || '未命名视频'}
                    </h2>
                    {video.caption && (
                        <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                            {video.caption}
                        </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>尺寸: {video.width} x {video.height}</span>
                            <span>格式: {video.mimeType}</span>
                            <span>发布日期: {new Date(video.date * 1000).toLocaleString()}</span>
                        </div>

                        <a
                            href={`${videoUrl}?download=true`}
                            download={video.fileName || `video_${video.fileId}.mp4`}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            下载视频
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
