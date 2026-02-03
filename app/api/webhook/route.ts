import { NextRequest, NextResponse } from 'next/server';
import { bot, VideoInfo } from '@/lib/telegram';
import { saveVideo } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 简单的解析逻辑
        if (body.message) {
            const { message } = body;

            // 检查是否包含视频
            if (message.video) {
                const video = message.video;
                const videoInfo: VideoInfo = {
                    fileId: video.file_id,
                    uniqueId: video.file_unique_id,
                    fileName: video.file_name,
                    mimeType: video.mime_type,
                    duration: video.duration,
                    width: video.width,
                    height: video.height,
                    thumbnail: video.thumb?.file_id,
                    caption: message.caption,
                    chatId: message.chat.id,
                    messageId: message.message_id,
                    date: message.date,
                };

                console.log('Detected video, saving to KV:', videoInfo.fileId);
                await saveVideo(videoInfo);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
