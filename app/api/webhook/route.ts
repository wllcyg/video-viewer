import { NextRequest, NextResponse } from 'next/server';
import { bot, VideoInfo } from '@/lib/telegram';
import { saveVideo } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Webhook received payload:', JSON.stringify(body, null, 2));

        // 支持多种消息类型
        const msg = body.message || body.channel_post || body.edited_message;

        if (msg) {
            console.log('Processing message from chat:', msg.chat.id);

            // 检查是否包含视频或作为文件的视频
            const video = msg.video || (msg.document?.mime_type?.startsWith('video/') ? msg.document : null);

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
                    caption: msg.caption || '',
                    chatId: msg.chat.id,
                    messageId: msg.message_id,
                    date: msg.date,
                };

                console.log('Attempting to save video to KV:', videoInfo.fileId);
                await saveVideo(videoInfo);
                console.log('Video saved successfully.');
            } else {
                console.log('No video found in this message.');
            }
        } else {
            console.log('Received non-message update:', Object.keys(body));
        }

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error('Webhook processing failed:', error);
        // 返回错误信息可以帮助我们在 getWebhookInfo 中看到一点（虽然 Telegram 可能截断）
        return NextResponse.json({
            ok: false,
            error: error.message || 'Internal Server Error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
