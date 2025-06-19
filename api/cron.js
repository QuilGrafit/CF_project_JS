import { connectToDatabase } from '../lib/db.js';
import { HoroscopeGenerator } from '../lib/horoscope.js';

export default async (req, res) => {
  const db = await connectToDatabase();
  const users = await db.collection('users').find({}).toArray();
  
  for (const user of users) {
    try {
      const horoscope = HoroscopeGenerator.generate(user);
      await bot.telegram.sendMessage(user.id, horoscope.text, {
        parse_mode: 'HTML',
        reply_markup: horoscope.keyboard
      });
    } catch (error) {
      console.error(`Error sending to ${user.id}:`, error);
    }
  }
  
  res.status(200).send('Cron job completed');
};
