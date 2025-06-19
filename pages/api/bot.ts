import { NextApiRequest, NextApiResponse } from 'next';
import { initBot } from '../../lib/botCore.ts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bot = await initBot();
  
  // Обработка вебхука
  await bot.handleUpdate(req.body);
  
  res.status(200).json({ status: 'processed' });
}

// Инициализация вебхука при старте
export async function setupWebhook() {
  const bot = await initBot();
  const webhookUrl = `${process.env.VERCEL_URL}/api/bot`;
  await bot.telegram.setWebhook(webhookUrl);
}
