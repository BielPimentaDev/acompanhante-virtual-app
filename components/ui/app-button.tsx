import { UI } from '@/constants/ui';
import {
    Pressable,
    StyleSheet,
    type PressableProps,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

import { AppText } from './app-text';

type AppButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function AppButton({ label, style, labelStyle, disabled, ...rest }: AppButtonProps) {
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
      <AppText variant="button" style={[styles.label, labelStyle]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: UI.radius.md,
    backgroundColor: UI.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: UI.colors.textOnPrimary,
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    backgroundColor: UI.colors.disabled,
  },
});
