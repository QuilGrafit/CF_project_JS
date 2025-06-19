import { VercelRequest, VercelResponse } from '@vercel/node'; // For Vercel specific types if needed, but not strictly required for basic setup
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { getBotInstance } from '../../lib/bot.js'; // Import the function to get the bot instance
import { setupHandlers } from '../../lib/handlers.js'; // Import function to set up handlers
import { setWebhookIfNeeded } from '../../lib/utils.js'; // Utility for webhook management

const bot = getBotInstance(); // Get the single bot instance

// Setup all handlers when the bot is initialized
setupHandlers(bot);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Process the Telegram update
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling update:', error);
      res.status(500).send('Internal Server Error');
    }
  } else if (req.method === 'GET') {
    // This path can be used to manually set the webhook if needed, or just for testing if the API is reachable.
    // In Vercel, the webhook is usually set once after deployment.
    const webhookUrl = `https://${req.headers.host}/api/webhook`;
    const success = await setWebhookIfNeeded(bot, webhookUrl);
    if (success) {
      res.status(200).send(`Webhook set to ${webhookUrl}`);
    } else {
      res.status(500).send('Failed to set webhook. Check logs.');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
