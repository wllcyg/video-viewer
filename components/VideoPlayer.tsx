import { useState, useEffect } from 'react';
import { VideoInfo } from '@/lib/telegram';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface VideoPlayerProps {
    video: VideoInfo;
    onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);

    // 在页面加载时，动态获取 Telegram 的直连地址
    useEffect(() => {
        const fetchRealUrl = async () => {
            try {
                setLoading(true);
                // 我们调用一个专门返回 JSON 地址的接口
                const res = await fetch(`/api/video/${video.fileId}?json=true`);

                // 先检查响应状态，避免解析非 JSON 错误响应
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`API 错误 (${res.status}): ${errorText}`);
                }

                const data = await res.json();
                if (data.url) {
                    setVideoUrl(data.url);
                } else {
                    throw new Error('响应中缺少 url 字段');
                }
            } catch (err) {
                console.error('获取视频直连地址失败:', err);
                // 降级使用重定向地址
                setVideoUrl(`/api/video/${video.fileId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRealUrl();
    }, [video.fileId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-300">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-50"
            >
                <XMarkIcon className="w-8 h-8" />
            </button>

            <div className="w-full max-w-4xl px-4 text-center">
                {loading ? (
                    <div className="flex flex-col items-center gap-4 text-white">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p>正在获取 Telegram 极速资源...</p>
                    </div>
                ) : (
                    <video
                        controls
                        autoPlay
                        className="w-full aspect-video rounded-lg shadow-2xl bg-black"
                        src={videoUrl}
                    >
                        您的浏览器不支持 HTML5 视频播放。
                    </video>
                )}

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
