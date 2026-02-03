import { kv } from '@vercel/kv';
import { VideoInfo } from './telegram';

const VIDEOS_KEY = 'telegram_videos';

export async function saveVideo(video: VideoInfo) {
    // 使用 LPUSH 保证最新的视频在前面
    await kv.lpush(VIDEOS_KEY, JSON.stringify(video));
}

export async function getVideos(limit = 50): Promise<VideoInfo[]> {
    const videos = await kv.lrange(VIDEOS_KEY, 0, limit - 1);
    return videos.map((v) => typeof v === 'string' ? JSON.parse(v) : v);
}
