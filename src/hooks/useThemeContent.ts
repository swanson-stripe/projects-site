import { useTheme } from '@/components/ui/ThemeContext';

/**
 * Returns the value for a content key from the active theme's content overrides,
 * falling back to the provided default when no override is defined.
 *
 * Usage in a component:
 *   const tagline = useThemeContent('hero.tagline', 'Default tagline text');
 */
export function useThemeContent(key: string, fallback: string): string {
  const { themeConfig } = useTheme();
  return themeConfig.content?.[key] ?? fallback;
}

/**
 * Returns the variant name for a section from the active theme's sectionVariants,
 * falling back to 'default' when no variant is defined.
 *
 * Usage in a component:
 *   const variant = useThemeSectionVariant('hero'); // 'minimal' | 'default' | etc.
 */
export function useThemeSectionVariant(sectionId: string): string {
  const { themeConfig } = useTheme();
  return themeConfig.sectionVariants?.[sectionId] ?? 'default';
}
