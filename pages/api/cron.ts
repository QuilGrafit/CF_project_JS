import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/db.ts';
import { HoroscopeGenerator } from '../../lib/horoscope.ts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Проверка секретного ключа для защиты
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = await connectToDatabase();
  const users = await db.collection('users').find().toArray();
  
  for (const user of users) {
    try {
      const horoscope = HoroscopeGenerator.generate(user);
      // Отправка через Telegram API
      await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: user.id,
          text: horoscope,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error(`Error sending to ${user.id}:`, error);
    }
  }

  res.status(200).json({ success: true, sent: users.length });
}
