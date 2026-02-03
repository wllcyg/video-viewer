'use client';

import { VideoInfo } from '@/lib/telegram';
import { PlayIcon } from '@heroicons/react/24/solid';

interface VideoCardProps {
    video: VideoInfo;
    onClick: (video: VideoInfo) => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
    const formattedDate = new Date(video.date * 1000).toLocaleDateString();
    const formattedDuration = video.duration
        ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`
        : '未知时长';

    return (
        <div
            className="group relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer border border-gray-800 hover:border-blue-500 transition-all duration-300"
            onClick={() => onClick(video)}
        >
            <div className="aspect-video bg-gray-800 relative flex items-center justify-center">
                {/* 在实际应用中，这里应该显示缩略图。Telegram 缩略图也需要通过 getFile 代理。 */}
                <div className="text-gray-600">
                    <PlayIcon className="w-12 h-12 group-hover:text-blue-500 transition-colors" />
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {formattedDuration}
                </div>
            </div>

            <div className="p-3">
                <h3 className="text-sm font-medium text-gray-200 truncate">
                    {video.fileName || video.caption || '视频'}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formattedDate}</span>
                    <span className="text-xs text-gray-400 capitalize">{video.mimeType?.split('/')[1] || 'video'}</span>
                </div>
            </div>
        </div>
    );
}
