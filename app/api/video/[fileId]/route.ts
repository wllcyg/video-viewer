import { NextRequest, NextResponse } from 'next/server';
import { bot, getFileDownloadUrl } from '@/lib/telegram';
import axios from 'axios';

export async function GET(
    req: NextRequest,
    { params }: { params: { fileId: string } }
) {
    const fileId = params.fileId;

    if (!fileId) {
        return new NextResponse('Missing fileId', { status: 400 });
    }

    try {
        console.log('Proxying video request for fileId:', fileId);
        const downloadUrl = await getFileDownloadUrl(fileId);
        console.log('Fetched download URL successfully.');

        // Vercel Serverless Function 有限制 (Payload size & Timeout)
        // 对于 1.6GB 这么大的视频，直接流式转发可能会被 Vercel 断开连接
        // 既然我们主要用于个人 H5 播放，直接重定向到 Telegram 的 CDN 地址通常是更稳健的选择
        // 只有当存在跨域问题无法播放时，才考虑中转。

        // 方案 1: 直接重定向 (推荐用于大文件)
        return NextResponse.redirect(downloadUrl);

        /* 
        // 方案 2: 保持中转 (如果重定向无法播放，请告诉我，我再换回这个并做优化)
        const response = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream',
            timeout: 10000, 
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const headers = new Headers();
        headers.set('Content-Type', response.headers['content-type'] || 'video/mp4');
        headers.set('Accept-Ranges', 'bytes');
        return new NextResponse(response.data as any, { status: 200, headers });
        */
    } catch (error: any) {
        console.error('Video proxy failed:', error.message);
        return new NextResponse(`Error fetching video content: ${error.message}`, { status: 500 });
    }
}
