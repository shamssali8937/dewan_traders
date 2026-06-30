import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string, currency = 'PKR'): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `${currency} ${num.toLocaleString('en-PK')}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function truncate(text: string, length = 150): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const CATEGORY_COLORS: Record<string, string> = {
  fruits: 'from-orange-400 to-amber-400',
  vegetables: 'from-teal-400 to-emerald-400',
  rice: 'from-indigo-400 to-violet-400',
  surgical: 'from-sky-400 to-cyan-400',
  sports: 'from-rose-400 to-orange-400',
};

export const CATEGORY_ICONS: Record<string, string> = {
  fruits: 'Leaf',
  vegetables: 'Sprout',
  rice: 'Wheat',
  surgical: 'Scissors',
  sports: 'Trophy',
};
