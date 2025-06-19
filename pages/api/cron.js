import cron from 'node-cron';

// Защищенный эндпоинт для ручного запуска рассылки
export default async (req, res) => {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Здесь будет логика рассылки
    console.log('Cron job executed');
    res.json({ success: true });
  } catch (err) {
    console.error('Cron error:', err);
    res.status(500).json({ error: 'Cron failed' });
  }
};

// Ежедневная рассылка в 9:00 по UTC
cron.schedule('0 9 * * *', () => {
  console.log('Running scheduled horoscope delivery');
  // Логика рассылки
});
