# Crypto Advisor

Веб-приложение для технического анализа криптовалютного рынка и управления инвестиционным портфелем. Работает полностью в браузере — без серверной части, без регистрации.

[![Deploy](https://github.com/eugenepokalyuk/ctypto-analysis/actions/workflows/deploy.yml/badge.svg)](https://github.com/eugenepokalyuk/ctypto-analysis/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-6366f1?logo=github)](https://eugenepokalyuk.github.io/ctypto-analysis/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](LICENSE)

**[→ Открыть приложение](https://eugenepokalyuk.github.io/ctypto-analysis/)**

---

## Что это

Инструмент для тех, кто уже держит криптовалюту и хочет понимать, когда покупать, держать или продавать — без шума и сложных платформ. Приложение анализирует 12 монет по трём классическим индикаторам и выдаёт однозначный сигнал: **STRONG BUY / BUY / HOLD / SELL / STRONG SELL**.

---

## Возможности

**Рыночный анализ**
- Котировки и технический анализ 12 монет: BTC, ETH, BNB, SOL, XRP, ADA, AVAX, DOT, LINK, UNI, DASH, ZEC
- Сигналы на основе RSI (14), MACD (12/26/9) и полос Боллинджера (20, 2σ)
- Детальная панель: свечной график, карточки индикаторов, цветовые причины сигнала
- Три режима отображения: сетка, список, сортируемая таблица

**Данные**
- 5 независимых источников с автоматическим переключением при недоступности
- GitHub Actions обновляет кэш каждые 5 минут — нулевая нагрузка на внешние API при любом трафике
- Ручной выбор источника: GitHub Cache · CoinGecko · Binance · CryptoCompare · CoinCap

**Портфель**
- Добавь монеты с ценой входа — приложение считает текущий P&L и прикладывает сигнал к каждой позиции
- Все данные хранятся в браузере, никуда не передаются

**UX**
- Добавление монет в избранное — всегда отображаются первыми
- Адаптивный дизайн: mobile-first, работает как PWA
- Плавные анимации на Framer Motion

---

## Технологии

| Слой | Технология |
|---|---|
| UI | React 18 + TypeScript |
| Стейт | Redux Toolkit + RTK Query |
| Анимации | Framer Motion |
| Стили | SCSS Modules |
| Графики | TradingView Lightweight Charts |
| Индикаторы | technicalindicators (RSI, MACD, BB) |
| Сборка | Vite |
| Деплой | GitHub Pages + GitHub Actions |

---

## Архитектура

Проект построен по **Feature-Sliced Design**:

```
src/
  app/        — инициализация, Redux store, глобальные стили
  pages/      — Рынок, Портфель
  widgets/    — CoinGrid, CoinList, CoinTable, CoinDetail, PortfolioPanel
  features/   — избранное, выбор источника данных, переключение макета
  entities/   — монета (индикаторы, UI), портфель (Redux slice + селекторы)
  shared/     — API провайдеры, UI kit, конфиг, типы
```

### Логика сигналов

```
RSI(14)   → < 30: +2   < 40: +1   > 60: -1   > 70: -2
MACD      → выше сигнала: +1       ниже: -1
BB %B     → < 20%: +1              > 80%: -1

Score ≥ 3 → STRONG_BUY   ≥ 1 → BUY   ≤ -1 → SELL   ≤ -3 → STRONG_SELL
```

### Источники данных

```
Предпочтительный источник
        ↓ (недоступен)
CoinGecko → Binance → CryptoCompare → CoinCap
        ↓ (первый успешный)
RTK Query кэширует на 5 минут
```

| Источник | Тип | Описание |
|---|---|---|
| GitHub Cache | Статика | Обновляется каждые 5 мин через GitHub Actions |
| CoinGecko | REST | Цены + OHLCV |
| Binance | REST | Klines (высокая точность) |
| CryptoCompare | REST | Дневные свечи |
| CoinCap | REST | Цены с псевдо-OHLCV |

---

## Запуск локально

```bash
git clone https://github.com/eugenepokalyuk/ctypto-analysis.git
cd ctypto-analysis
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173/ctypto-analysis/`.

> При локальном запуске `data.json` пустой — приложение автоматически обращается к CoinGecko.

---

## Деплой на GitHub Pages

1. Settings → Pages → Source: **GitHub Actions**
2. Любой пуш в `main` → автоматический деплой через `.github/workflows/deploy.yml`
3. Для первичного наполнения кэша: запустить `fetch-market-data.yml` через Actions → `workflow_dispatch`

---

## Лицензия

MIT © [Evgenii Pokalyuk](https://github.com/eugenepokalyuk)
