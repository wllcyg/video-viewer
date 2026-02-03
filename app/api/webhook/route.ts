import { NextRequest, NextResponse } from 'next/server';
import { bot, VideoInfo } from '@/lib/telegram';
import { saveVideo } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // 简单的解析逻辑
        if (body.message) {
            const { message } = body;
            console.log('Incoming message text:', message.text || 'No text');

            // 检查是否包含视频或作为文件的视频
            const video = message.video || (message.document?.mime_type?.startsWith('video/') ? message.document : null);

            if (video) {
                const videoInfo: VideoInfo = {
                    fileId: video.file_id,
                    uniqueId: video.file_unique_id,
                    fileName: video.file_name || video.file_unique_id,
                    mimeType: video.mime_type,
                    duration: video.duration || 0,
                    width: video.width || 0,
                    height: video.height || 0,
                    thumbnail: video.thumb?.file_id,
                    caption: message.caption,
                    chatId: message.chat.id,
                    messageId: message.message_id,
                    date: message.date,
                };

                console.log('Detected video/document, saving to KV:', videoInfo.fileId);
                await saveVideo(videoInfo);
            } else {
                console.log('Message does not contain a recognizable video object.');
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
