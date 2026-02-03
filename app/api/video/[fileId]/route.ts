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

        const isJson = req.nextUrl.searchParams.get('json') === 'true';

        if (isJson) {
            return NextResponse.json({ url: downloadUrl });
        }

        // 默认行为：重定向
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
