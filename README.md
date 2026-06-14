# Data Narrative Studio

![Data Narrative Studio Banner](public/screenshot.png)

## Project Overview

**Data Narrative Studio** is a narrative-driven full-stack data platform designed to transform complex datasets, model execution results, and AI insights into structured, interactive stories.

This project combines modern web technologies with data science workflows, providing a complete pipeline from data ingestion and ETL processing to AI insight generation and final story presentation.

## Core Features

- 🎨 **Story Renderer**: Supports fluid rendering of multiple block types including text, charts, and insights.
- 📊 **Multi-dimensional Visualization**: Integrates ECharts and Recharts for rich, interactive data presentation.
- 🔍 **Dataset Browser**: Easily explore, filter, and export datasets.
- 🤖 **AI Insight Integration**: Built-in Python script support (ETL, ML, NLP) for automated trend analysis and data reporting.
- 🛠️ **Admin Dashboard**: Visual editor for story composition and data pipeline management.
- 🌓 **Theme Support**: Includes dark and light modes with smooth UI interactions.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: Shadcn UI, Lucide React
- **Charts**: Apache ECharts, Recharts
- **Backend**: Next.js API Routes, Mongoose (MongoDB)
- **Auth**: NextAuth.js (Auth.js)
- **Data Pipeline**: Python (Scripts for ML/NLP/ETL)

## Getting Started

### 1. Environment Configuration
Copy `.env.example` and fill in the required information (e.g., MongoDB URI, NextAuth Secret).

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Data Initialization (Optional)
To import sample data, ensure your Python environment is configured:
```bash
# Activate virtual environment and run the seed script
source venv/bin/activate
python scripts/python/seed_sample_data.py
```

## Project Structure

- `/src/app`: Next.js pages and API routes.
- `/src/components`: Reusable UI components and business logic.
- `/src/lib`: Data models, utility functions, and core logic.
- `/scripts`: Python scripts for data processing and AI analysis.

---

*Maintained by Justin21523.*
