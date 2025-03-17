# Modern Kanban Board

A modern, feature-rich Kanban board application built with React, TypeScript, and Tailwind CSS. This application provides a smooth and intuitive interface for managing tasks with drag-and-drop functionality, real-time updates, and a beautiful UI.

## Features

- 🎯 **Intuitive Task Management**
  - Drag and drop tasks between columns
  - Create, edit, and delete tasks
  - Assign tasks to team members
  - Set priority levels (Low, Medium, High)
  - Add due dates
  - Apply labels/tags to tasks

- 💫 **Modern UI/UX**
  - Clean and minimalist design
  - Smooth animations and transitions
  - Responsive layout
  - Beautiful glassmorphism effects
  - Touch-friendly interface

- 🛠 **Technical Features**
  - TypeScript for type safety
  - State management with Zustand
  - Drag and drop powered by `@dnd-kit`
  - Date handling with `date-fns`
  - Icons from `lucide-react`
  - Styling with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Drag & Drop**: @dnd-kit
- **Date Handling**: date-fns
- **Icons**: lucide-react
- **Build Tool**: Vite
- **Package Manager**: npm/yarn/pnpm

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd kanban
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

## Project Structure

```
src/
├── components/         # React components
│   ├── Column.tsx     # Kanban column component
│   ├── TaskCard.tsx   # Individual task card
│   ├── TaskDialog.tsx # Task creation dialog
│   └── TaskDetailsDialog.tsx # Task details/edit dialog
├── store/
│   └── boardStore.ts  # Zustand store for state management
├── types/
│   └── index.ts       # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Task Management
- Create new tasks with title, description, assignee, due date, priority, and labels
- Edit existing tasks
- Delete tasks
- Move tasks between columns via drag and drop
- View task details in a modal dialog

### Column System
- Four default columns: To Do, In Progress, Testing, and Done
- Visual feedback during drag operations
- Task count display per column
- Empty column placeholders

### User Interface
- Glassmorphic design elements
- Smooth animations for all interactions
- Responsive layout that works on all device sizes
- Touch-optimized for mobile devices
- Custom scrollbar styling
- Beautiful hover and active states

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.