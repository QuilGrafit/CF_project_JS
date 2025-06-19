import { Telegraf } from 'telegraf';

// Utility function to set webhook, designed to be called only when needed
export async function setWebhookIfNeeded(bot, webhookUrl) {
    try {
        const currentWebhookInfo = await bot.telegram.getWebhookInfo();
        if (currentWebhookInfo.url !== webhookUrl) {
            await bot.telegram.setWebhook(webhookUrl, {
                drop_pending_updates: true // Drops pending updates when setting a new webhook
            });
            console.log(`Webhook successfully set to: ${webhookUrl}`);
            return true;
        } else {
            console.log(`Webhook is already set to: ${webhookUrl}`);
            return true;
        }
    } catch (error) {
        console.error('Error setting webhook:', error);
        return false;
    }
}

// Function to get the full webhook URL dynamically in a Vercel environment
export function getWebhookUrl(req) {
    const host = req ? req.headers.host : process.env.VERCEL_URL;
    if (host) {
        return `https://${host}/api/webhook`;
    }
    // Fallback for local development if not using ngrok or VERCEL_URL
    return process.env.WEBHOOK_URL || null;
}
