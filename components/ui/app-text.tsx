import { DesignSystem } from '@/constants/design-system';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

type TextVariant =
  | 'title'
  | 'sectionTitle'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'button';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
};

export function AppText({ variant = 'body', color, style, ...rest }: AppTextProps) {
  return <Text {...rest} style={[styles.base, styles[variant], color ? { color } : null, style]} />;
}

const styles = StyleSheet.create<Record<TextVariant | 'base', TextStyle>>({
  base: {
    color: DesignSystem.colors.textPrimary,
  },
  title: {
    fontSize: DesignSystem.typography.title,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: DesignSystem.typography.sectionTitle,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: DesignSystem.typography.subtitle,
    fontWeight: '500',
  },
  body: {
    fontSize: DesignSystem.typography.body,
    lineHeight: 26,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: DesignSystem.typography.body,
    lineHeight: 26,
    fontWeight: '600',
  },
  caption: {
    fontSize: DesignSystem.typography.caption,
    lineHeight: 20,
    fontWeight: '500',
  },
  button: {
    fontSize: DesignSystem.typography.button,
    fontWeight: '700',
  },
});
