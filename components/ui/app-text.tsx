import { UI } from '@/constants/ui';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

type TextVariant =
  | 'title'
  | 'sectionTitle'
  | 'subtitle'
    | 'bigText'
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
    color: UI.colors.text,
    fontFamily: 'Inter_400Regular',
  },
  title: {
    fontSize: UI.text.title,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: UI.text.subtitle,
    fontFamily: 'Inter_500Medium',
  },
  bigText:{
    fontSize: 16,
    fontFamily: 'Inter_500Medium'
  },
  body: {
    fontSize: UI.text.body,
    lineHeight: 26,
    fontFamily: 'Inter_400Regular',
  },
  bodyStrong: {
    fontSize: UI.text.body,
    lineHeight: 26,
    fontFamily: 'Inter_600SemiBold',
  },
  caption: {
    fontSize: UI.text.caption,
    lineHeight: 20,
    fontFamily: 'Inter_500Medium',
  },
  button: {
    fontSize: UI.text.button,
    fontFamily: 'Inter_700Bold',
  },
});
