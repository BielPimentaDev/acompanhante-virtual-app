import { DesignSystem } from '@/constants/design-system';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './app-text';

type AppButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ label, style, disabled, ...rest }: AppButtonProps) {
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}>
      <AppText variant="button" style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: DesignSystem.radius.md,
    backgroundColor: DesignSystem.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: DesignSystem.colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    backgroundColor: DesignSystem.colors.neutralSoft,
  },
});
