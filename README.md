# MHCalendar for React

[![NPM Version](https://img.shields.io/npm/v/mh-calendar-react.svg)](https://www.npmjs.com/package/mh-calendar-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docs](https://img.shields.io/badge/documentation-site-blue.svg)]([https://mh-calendar.github.io/mh-calendar-docs])

The official React wrapper for MHCalendar, a powerful and fully customizable calendar component.

## ✨ Features

-   🗓️ **Multiple Views**: Seamlessly switch between Day, Week, and Month layouts.
-   ⚡️ **Intuitive Drag & Drop**: Move events with ease.
-   🎨 **Highly Customizable**: Style every aspect with standard CSS or CSS-in-JS.
-   🧩 **Built for React**: Provides a native React experience with the `useCalendarApi` hook.

---

## 🚀 Installation

Install the React wrapper using your preferred package manager:

**npm**
```bash
npm install mh-calendar-react
```

**Yarn**
```bash
yarn add mh-calendar-react
```

**pnpm**
```bash
pnpm add mh-calendar-react
```

**Bun**
```bash
bun add mh-calendar-react
```

---

## Basic Usage

```jsx
import React from 'react';
import { MhCalendar } from 'mh-calendar-react';

function MyCalendarPage() {
  // Define your configuration object
  const calendarConfig = {
    viewType: 'WEEK',
    editable: true,
    events: [
      {
        id: 'evt-1',
        title: 'Team Meeting',
        startDate: new Date('2024-10-28T10:00:00'),
        endDate: new Date('2024-10-28T11:00:00'),
      },
      {
        id: 'evt-2',
        title: 'Project Deadline',
        startDate: new Date('2024-10-29T14:30:00'),
        endDate: new Date('2024-10-29T15:30:00'),
      }
    ],
  };

  return (
    <div style={{ height: '90vh' }}>
      <MhCalendar config={calendarConfig} />
    </div>
  );
}

export default MyCalendarPage;
```

---

## 📚 Full Documentation

For detailed information on all configuration options, please visit our **[full documentation site]([https://mh-calendar.github.io/mh-calendar-docs])**.

## 📄 License

This project is licensed under the MIT License.