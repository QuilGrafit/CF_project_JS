import { getTexts } from './texts.js';

export class HoroscopeGenerator {
    static SIGNS = {
        "aries": { "emoji": "♈️", "element_key": "element_fire", "character": ["энергичный", "смелый", "импульсивный"], "planet_key": "planet_mars", "lucky_number": [9], "lucky_stone_key": "stone_diamond" },
        "taurus": { "emoji": "♉️", "element_key": "element_earth", "character": ["стабильный", "терпеливый", "упрямый"], "planet_key": "planet_venus", "lucky_number": [6], "lucky_stone_key": "stone_emerald" },
        "gemini": { "emoji": "♊️", "element_key": "element_air", "character": ["адаптивный", "любопытный", "нерешительный"], "planet_key": "planet_mercury", "lucky_number": [5], "lucky_stone_key": "stone_agate" },
        "cancer": { "emoji": "♋️", "element_key": "element_water", "character": ["заботливый", "эмоциональный", "защитник"], "planet_key": "planet_moon", "lucky_number": [2], "lucky_stone_key": "stone_pearl" },
        "leo": { "emoji": "♌️", "element_key": "element_fire", "character": ["уверенный", "щедрый", "властный"], "planet_key": "planet_sun", "lucky_number": [1], "lucky_stone_key": "stone_ruby" },
        "virgo": { "emoji": "♍️", "element_key": "element_earth", "character": ["аналитический", "практичный", "критичный"], "planet_key": "planet_mercury", "lucky_number": [5], "lucky_stone_key": "stone_sapphire" },
        "libra": { "emoji": "♎️", "element_key": "element_air", "character": ["гармоничный", "дипломатичный", "нерешительный"], "planet_key": "planet_venus", "lucky_number": [6], "lucky_stone_key": "stone_opal" },
        "scorpio": { "emoji": "♏️", "element_key": "element_water", "character": ["интенсивный", "страстный", "скрытный"], "planet_key": "planet_pluto", "lucky_number": [8], "lucky_stone_key": "stone_topaz" },
        "sagittarius": { "emoji": "♐️", "element_key": "element_fire", "character": ["авантюрный", "оптимистичный", "беспокойный"], "planet_key": "planet_jupiter", "lucky_number": [3], "lucky_stone_key": "stone_turquoise" },
        "capricorn": { "emoji": "♑️", "element_key": "element_earth", "character": ["дисциплинированный", "ответственный", "пессимистичный"], "planet_key": "planet_saturn", "lucky_number": [8], "lucky_stone_key": "stone_garnet" },
        "aquarius": { "emoji": "♒️", "element_key": "element_air", "character": ["инновационный", "независимый", "безэмоциональный"], "planet_key": "planet_uranus", "lucky_number": [4], "lucky_stone_key": "stone_amethyst" },
        "pisces": { "emoji": "♓️", "element_key": "element_water", "character": ["сострадательный", "артистичный", "склонный к эскапизму"], "planet_key": "planet_neptune", "lucky_number": [7], "lucky_stone_key": "stone_aquamarine" },
    };

    static MOODS = {
        "ru": ["Оптимистичное", "Задумчивое", "Энергичное", "Спокойное", "Осторожное", "Радостное", "Вдохновленное", "Гармоничное", "Надежное", "Безмятежное", "Воодушевленное", "Сосредоточенное", "Жизнерадостное", "Умиротворенное", "Интуитивное", "Смелое", "Душевное", "Прагматичное", "Веселое", "Серьезное"],
    };
    static LUCKY_COLORS = {
        "ru": ["Синий", "Зеленый", "Золотой", "Серебряный", "Красный", "Фиолетовый", "Розовый", "Желтый", "Бирюзовый", "Лавандовый", "Оранжевый", "Белый", "Черный", "Коричневый", "Серый", "Индиго", "Бордовый", "Голубой", "Персиковый", "Мятный"],
    };
    static COMPATIBILITY = {
        "aries": ["leo", "sagittarius", "gemini", "aquarius"], "taurus": ["virgo", "capricorn", "cancer", "pisces"],
        "gemini": ["libra", "aquarius", "aries", "leo"], "cancer": ["scorpio", "pisces", "taurus", "virgo"],
        "leo": ["aries", "sagittarius", "gemini", "libra"], "virgo": ["taurus", "capricorn", "cancer", "scorpio"],
        "libra": ["gemini", "aquarius", "leo", "sagittarius"], "scorpio": ["cancer", "pisces", "virgo", "capricorn"],
        "sagittarius": ["aries", "leo", "libra", "aquarius"], "capricorn": ["taurus", "virgo", "scorpio", "pisces"],
        "aquarius": ["gemini", "libra", "aries", "sagittarius"], "pisces": ["cancer", "scorpio", "taurus", "capricorn"],
    };

    static COOKIE_FORTUNES = [
        "Вас ждет неожиданная удача.",
        "Прислушайтесь к своему внутреннему голосу.",
        "Сегодня идеальный день для новых начинаний.",
        "Ваша доброта будет вознаграждена.",
        "Не бойтесь перемен, они к лучшему.",
        "Вас ждет приятная встреча.",
        "Сосредоточьтесь на своих мечтах.",
        "Ваше упорство принесет плоды.",
        "Найдите радость в мелочах.",
        "Впереди вас ждет увлекательное приключение.",
        "День принесет новые возможности.",
        "Будьте открыты для новых идей.",
        "Скоро вы обретете то, что искали.",
        "Ваши усилия принесут плоды.",
        "Доверьтесь процессу.",
        "Вас ждут приятные новости.",
        "Наслаждайтесь моментом.",
        "Позитивные мысли притягивают успех.",
        "Вы на правильном пути.",
        "Чудо совсем рядом.",
        "Ваша смелость будет вознаграждена.",
        "Откройте свое сердце новым возможностям.",
        "Верьте в себя, и все получится.",
        "Вдохновение придет неожиданно."
    ];

    static MAGIC_BALL_ANSWERS = {
        "positive": [
            "Безусловно!", "Да.", "Весьма вероятно.", "Можете быть уверены в этом.", "Да, определенно.",
            "Без сомнения.", "Как я вижу, да.", "Источник говорит: да.", "Это точно.", "Да, в добрый час!"
        ],
        "negative": [
            "Мои источники говорят нет.", "Очень сомнительно.", "Не рассчитывайте на это.", "Нет.", "Перспективы не очень хорошие.",
            "Даже не думай.", "К сожалению, нет.", "Мой ответ - нет.", "Вряд ли.", "Очень мало шансов."
        ],
        "neutral": [
            "Сконцентрируйся и спроси снова.", "Ответ неясен, попробуй еще раз.", "Лучше не говорить тебе сейчас.",
            "Не могу предсказать сейчас.", "Повторите вопрос позже.", "Нужен более точный вопрос.", "Предсказание невозможно.", "Возможно, но не сейчас."
        ]
    };

    static DAILY_MOTIVATION = [
        "Всё, что ты можешь вообразить — реально. Смело иди к своим мечтам!",
        "Начни сегодня, а не завтра. Твой успех ждет тебя!",
        "Верь в себя, и всё невозможное станет возможным.",
        "Каждый день — это новый шанс изменить свою жизнь к лучшему.",
        "Твоя сила внутри тебя. Раскрой свой потенциал!",
        "Не бойся ошибаться. Ошибки — это уроки на пути к совершенству.",
        "Благодарность приумножает всё хорошее в твоей жизни. Цени то, что имеешь.",
        "Будь источником света для себя и окружающих.",
        "Твоя уникальность — твоя суперсила. Используй её мудро.",
        "Сосредоточься на своих целях, и ты удивишься, как быстро они приблизятся.",
        "Пусть твоё сердце будет наполнено любовью, а ум — ясностью.",
        "Сегодня — идеальный день, чтобы стать лучшей версией себя.",
        "Не останавливайся, пока не будешь гордиться собой.",
        "Счастье не в пункте назначения, а в самом путешествии.",
        "Каждая маленькая победа ведет к большим достижениям.",
        "Окружай себя теми, кто верит в тебя.",
        "Ты сильнее, чем думаешь. Преодолей любые препятствия.",
        "Позволь себе быть счастливым и успешным.",
        "Твоя энергия создает твою реальность. Наполняй её позитивом.",
        "Иди вперед с уверенностью и решимостью. Вселенная поддержит тебя."
    ];


    static _generateAspectDescription(aspect, score, rng, lang) {
        const descriptions = {
            [getTexts(lang)["horoscope_love"]]: {
                "8-10": getTexts(lang)["love_horoscope_8_10"],
                "5-7": getTexts(lang)["love_horoscope_5_7"],
                "3-4": getTexts(lang)["love_horoscope_3_4"],
                "1-2": getTexts(lang)["love_horoscope_1_2"]
            },
            [getTexts(lang)["horoscope_career"]]: {
                "8-10": getTexts(lang)["career_horoscope_8_10"],
                "5-7": getTexts(lang)["career_horoscope_5_7"],
                "3-4": getTexts(lang)["career_horoscope_3_4"],
                "1-2": getTexts(lang)["career_horoscope_1_2"]
            },
            [getTexts(lang)["horoscope_finance"]]: {
                "8-10": getTexts(lang)["finance_horoscope_8_10"],
                "5-7": getTexts(lang)["finance_horoscope_5_7"],
                "3-4": getTexts(lang)["finance_horoscope_3_4"],
                "1-2": getTexts(lang)["finance_horoscope_1_2"]
            },
            [getTexts(lang)["horoscope_health"]]: {
                "8-10": getTexts(lang)["health_horoscope_8_10"],
                "5-7": getTexts(lang)["health_horoscope_5_7"],
                "3-4": getTexts(lang)["health_horoscope_3_4"],
                "1-2": getTexts(lang)["health_horoscope_1_2"]
            }
        };

        for (const rangeStr in descriptions[aspect]) {
            const [minScore, maxScore] = rangeStr.split('-').map(Number);
            if (score >= minScore && score <= maxScore) {
                const choices = descriptions[aspect][rangeStr];
                return choices[Math.floor(rng() * choices.length)]; // Use the passed RNG
            }
        }
        return "";
    }

    static calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    static getZodiacSign(birthDate) {
        const month = birthDate.getMonth() + 1; // getMonth() is 0-indexed
        const day = birthDate.getDate();

        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
        if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
        if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
        if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
        if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
        if ((month === 2 && day >= 19) || (month === 3 and day <= 20)) return "pisces";
        return "aries"; // Default fallback
    }

    static getYearEnding(age, lang) {
        const TEXTS = getTexts(lang);
        if (age % 10 === 1 && age % 100 !== 11) {
            return TEXTS["years_singular"];
        } else if (age % 10 >= 2 && age % 10 <= 4 && (age % 100 < 10 || age % 100 >= 20)) {
            return TEXTS["years_plural_2_4"];
        } else {
            return TEXTS["years_plural_5_plus"];
        }
    }

    static generate(userId, userData) {
        const lang = userData.lang || 'ru';
        const TEXTS = getTexts(lang);
        const signKey = userData.sign || "aries"; // Default to aries if not set
        const today = new Date();
        const todayFormatted = today.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');

        // Simple deterministic random number generator for consistency per day/user/sign
        // Using a basic LCG, not cryptographically secure, but sufficient for this purpose.
        const seedStr = `${userId}_${today.getFullYear()}${today.getMonth()}${today.getDate()}_${signKey}`;
        let seed = 0;
        for (let i = 0; i < seedStr.length; i++) {
            seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
            seed |= 0; // Convert to 32bit integer
        }

        const mulberry32 = (a) => {
            return function() {
              a |= 0; a = a + 0x6D2B79F5 | 0;
              var t = Math.imul(a ^ a >>> 15, 1 | a);
              t = t + Math.imul(t ^ t >>> 7, 61 | t) | 0;
              return ((t ^ t >>> 14) >>> 0) / 4294967296;
            }
        }
        const rng = mulberry32(seed); // Get a pseudo-random number generator instance

        // Generation of aspects
        const aspects = {
            [TEXTS["horoscope_love"]]: Math.floor(rng() * 10) + 1, // 1 to 10
            [TEXTS["horoscope_career"]]: Math.floor(rng() * 10) + 1,
            [TEXTS["horoscope_finance"]]: Math.floor(rng() * 10) + 1,
            [TEXTS["horoscope_health"]]: Math.floor(rng() * 10) + 1
        };

        // Additional forecast elements
        const signInfo = HoroscopeGenerator.SIGNS[signKey] || {};
        const mood = HoroscopeGenerator.MOODS[lang][Math.floor(rng() * HoroscopeGenerator.MOODS[lang].length)];
        const luckyColor = HoroscopeGenerator.LUCKY_COLORS[lang][Math.floor(rng() * HoroscopeGenerator.LUCKY_COLORS[lang].length)];
        const luckyNumber = signInfo.lucky_number ? signInfo.lucky_number[Math.floor(rng() * signInfo.lucky_number.length)] : Math.floor(rng() * 9) + 1;

        const rulingPlanet = TEXTS[signInfo.planet_key || "planet_crystal"];
        const luckyStone = TEXTS[signInfo.lucky_stone_key || "stone_crystal"];

        const availableCompatibleSigns = HoroscopeGenerator.COMPATIBILITY[signKey] || [];
        const compatibleSignsKeys = [];
        if (availableCompatibleSigns.length > 0) {
            // Select 2 random unique compatible signs
            const shuffled = availableCompatibleSigns.sort(() => 0.5 - rng()); // Shuffle using the PRNG
            compatibleSignsKeys.push(...shuffled.slice(0, Math.min(2, shuffled.length)));
        }

        const compatibleSigns = compatibleSignsKeys.map(s => TEXTS[`sign_${s}`]);
        if (compatibleSigns.length === 0) {
            compatibleSigns.push(TEXTS["compatibility_not_defined"]);
        }

        const tips = TEXTS["horoscope_tips"] || ["Сегодня отличный день!", "Будьте внимательны к деталям!"];

        // Formatting
        let horoscopeText = TEXTS["horoscope_title"].replace('{emoji}', signInfo.emoji || '✨') + "\n\n";
        horoscopeText += TEXTS["horoscope_sign"].replace('{sign}', TEXTS[`sign_${signKey}`]).replace('{element}', TEXTS[signInfo.element_key || '']) + "\n";
        horoscopeText += TEXTS["horoscope_date"].replace('{date}', todayFormatted) + "\n";

        if (userData.birth_date) {
            try {
                const [day, month, year] = userData.birth_date.split('.').map(Number);
                const birthDateObj = new Date(year, month - 1, day);
                const age = HoroscopeGenerator.calculateAge(birthDateObj);
                const yearsEnding = HoroscopeGenerator.getYearEnding(age, lang);
                horoscopeText += TEXTS["horoscope_age"].replace('{age}', age).replace('{years}', yearsEnding) + "\n";
            } catch (error) {
                console.error(`Invalid birth date format for user ${userId}: ${userData.birth_date}`, error);
            }
        }

        horoscopeText += "\n";

        for (const aspectName in aspects) {
            const score = aspects[aspectName];
            let ratingEmoji = "";
            if (score >= 8) ratingEmoji = "🌟";
            else if (score >= 5) ratingEmoji = "✨";
            else if (score >= 3) ratingEmoji = "⚠️";
            else ratingEmoji = "🚨";

            const description = HoroscopeGenerator._generateAspectDescription(
                aspectName,
                score,
                rng, // Pass the PRNG to the description generator
                lang
            );
            horoscopeText += `${aspectName}: ${ratingEmoji} ${score}/10\n<i>\" ${description} \"</i>\n\n`;
        }

        horoscopeText += (
            `${TEXTS["horoscope_mood"].replace('{mood}', mood)}\n` +
            `${TEXTS["horoscope_lucky_color"].replace('{color}', luckyColor)}\n` +
            `${TEXTS["horoscope_lucky_number"].replace('{number}', luckyNumber)}\n` +
            `${TEXTS["horoscope_ruling_planet"].replace('{planet}', rulingPlanet)}\n` +
            `${TEXTS["horoscope_lucky_stone"].replace('{stone}', luckyStone)}\n` +
            `${TEXTS["horoscope_compatibility"].replace('{compatible_signs}', compatibleSigns.join(', '))}\n\n` +
            `${TEXTS["horoscope_tip"].replace('{tip}', tips[Math.floor(rng() * tips.length)])}\n\n` +
            `<i>${TEXTS["horoscope_closing_message"]}</i>`
        );
        return horoscopeText;
    }
}
