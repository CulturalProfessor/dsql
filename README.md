# SQL Playground

## Overview

SQL Playground is a web-based SQL query runner designed for data analysts. It allows users to write, execute, and visualize SQL queries with ease. Key features include query history, syntax highlighting, error handling, and result visualization. It works entirely in the browser without the need for a backend, enabling seamless query execution on CSV files.

## Deployed App

You can view the live application here:

[**SQL Playground - Deployed App**](https://dsql-nine.vercel.app/)

## Video Walkthrough

You can watch a video walkthrough of the application here:

[**Video Walkthrough**](#)

## Features

### Core Features
- **SQL Query Input**: Code editor with SQL syntax highlighting and autocomplete.
- **Query Execution**: Run single or multiple SQL queries and retrieve results.
- **Result Display**: Display query results in a structured, paginated table with column sorting.

### Value-Added Features
- **Query History**: Save and retrieve previously executed queries (stored in local storage).
- **CSV Upload**: Import CSV files (up to 15MB) with automatic column detection.
- **Error Handling**: Real-time syntax validation with error messages and correction suggestions.
- **Export Results**: Download query results in CSV format.
- **Charts Visualization**: Generate bar, pie, and line charts for simple queries.
- **Pagination & Sorting**: Improves UI for large result sets.
- **Query Performance Metrics**: Display execution time for optimization insights.
- **Table View Toggle**: Switch between two result tables or compare them side by side.

## Technology Stack

### Core Technologies
- **React** (react, react-dom) – Main UI library
- **TypeScript** (typescript) – Static type checking
- **Vite** (vite) – Build tool for fast development
- **ESLint** (eslint, typescript-eslint) – Linting for code quality

### UI Framework & Styling
- **Chakra UI** (@chakra-ui/react) – Component library
- **Emotion** (@emotion/react) – CSS-in-JS styling
- **Lucide React** (lucide-react) – Icon library

### SQL & Data Handling
- **AlaSQL** (alasql) – SQL execution in the browser
- **PapaParse** (papaparse) – CSV parsing

### Code Editor Integration
- **Ace Editor** (ace-builds, react-ace) – In-browser SQL code editor

### Data Visualization
- **Chart.js** (chart.js, react-chartjs-2) – Chart rendering
- **React Window** (react-window) – Virtualized list rendering

### State Management & Theming
- **React Context** – Global Context for states
- **Split.js** (split.js) – Resizable panels

## Setup Instructions

### Prerequisites

Make sure you have the following tools installed:

- **Node.js** (v16 or higher)
- **npm** (Node package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CulturalProfessor/dsql.git

2. Navigate to the project folder:

   ```bash
   cd dsql

3. Install dependencies:

   ```bash
   npm install
   
4. Start the development server:

    ```bash
    npm run dev
    
Open your browser and visit http://localhost:5173 .