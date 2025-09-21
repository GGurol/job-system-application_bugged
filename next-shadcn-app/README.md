# Next.js with shadcn/ui Setup

This project is a Next.js application integrated with TypeScript and the shadcn/ui design system, utilizing Tailwind CSS for styling.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd next-shadcn-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000` to view the application.

## Project Structure

- `src/app`: Contains the main application files.
- `src/components`: Houses all reusable UI components.
- `src/styles`: Contains global styles and Tailwind CSS configuration.
- `src/types`: TypeScript types for the application.
- `public`: Static assets like images and icons.

## Components

The following UI components are included in the project:

- **Button**: A versatile button component with multiple variants and sizes.
- **Card**: A component system for displaying content in a card format.
- **Input**: A styled input component with accessibility features.
- **Label**: A label component using Radix UI's Label primitive.
- **Form**: A comprehensive form component integrated with react-hook-form.
- **Dialog**: A modal component system using Radix UI primitives.
- **Badge**: A component for displaying status or notifications.
- **Avatar**: A component for displaying user images.
- **Dropdown Menu**: A component for creating dropdown menus.
- **Skeleton**: A loading state component with an animated shimmer effect.
- **Alert**: A component for displaying alerts with different types.
- **Separator**: A visual separator component.
- **Table**: A semantic table component.
- **Progress**: A progress indicator component.
- **Toast**: A notification system for displaying messages.

## Styling

The project uses Tailwind CSS for styling, with a configuration that supports dark mode and a complete color palette. Global styles are defined in `src/styles/globals.css`.

## TypeScript

The project is set up with TypeScript for type safety and better development experience. Type definitions are located in the `src/types` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.