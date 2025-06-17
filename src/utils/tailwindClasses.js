
import clsx from 'clsx';

export const backdropClasses = clsx(
  'fixed inset-0 bg-black/50 z-[9998]',
  'transition-opacity p-2',
  'data-closed:opacity-0',
  'data-enter:duration-300 data-enter:ease-out',
  'data-leave:duration-200 data-leave:ease-in'
);

export const dialogPanelClasses = clsx(
  'relative p-3 transform overflow-hidden sm:rounded-lg rounded-none bg-white text-left shadow-xl transition-all',
  'sm:my-4 sm:w-full sm:max-w-5xl',
  'sm:max-h-[90vh] h-full overflow-y-auto',
  'data-closed:translate-y-2 data-closed:opacity-0',
  'data-enter:duration-300 data-enter:ease-out',
  'data-leave:duration-200 data-leave:ease-in',
  'data-closed:sm:translate-y-0 data-closed:sm:scale-95'
);

// Add more reusable class sets here as needed
