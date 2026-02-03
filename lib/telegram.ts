import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

// 在 Vercel 等无服务环环境中，我们不需要启用 polling
// 我们将使用 Webhook 来处理消息
export const bot = new TelegramBot(token, { polling: false });

export interface VideoInfo {
    fileId: string;
    uniqueId: string;
    fileName?: string;
    mimeType?: string;
    duration?: number;
    width?: number;
    height?: number;
    thumbnail?: string;
    caption?: string;
    chatId: number;
    messageId: number;
    date: number;
}

export async function getFileDownloadUrl(fileId: string) {
    const file = await bot.getFile(fileId);
    return `https://api.telegram.org/file/bot${token}/${file.file_path}`;
}
