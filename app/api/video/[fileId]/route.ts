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
        const downloadUrl = await getFileDownloadUrl(fileId);

        // 使用 axios 流式获取 Telegram 服务器上的文件内容
        const response = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        // 设置响应头以支持视频流
        const headers = new Headers();
        headers.set('Content-Type', response.headers['content-type'] || 'video/mp4');
        headers.set('Content-Length', response.headers['content-length']);
        headers.set('Accept-Ranges', 'bytes');

        // 如果包含 download 参数，则设置 Content-Disposition 以触发下载
        const isDownload = req.nextUrl.searchParams.get('download') === 'true';
        if (isDownload) {
            headers.set('Content-Disposition', 'attachment; filename="video.mp4"');
        }

        // 我们可以直接返回底层流吗？Next.js 14 的 NextResponse 支持 ReadableStream
        // @ts-ignore
        return new NextResponse(response.data, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Video proxy error:', error);
        return new NextResponse('Error fetching video content', { status: 500 });
    }
}
