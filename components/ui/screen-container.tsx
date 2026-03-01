import { UI } from '@/constants/ui';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  paddingTop?: number;
  paddingHorizontal?: number;
  backgroundColor?: string;
  safeTop?: boolean;
};

export function ScreenContainer({
  children,
  style,
  paddingTop = UI.spacing.top,
  paddingHorizontal = UI.spacing.horizontal,
  backgroundColor,
  safeTop = true,
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      edges={safeTop ? ['top'] : []}
      style={[
        styles.base,
        {
          backgroundColor: backgroundColor ?? UI.colors.background,
          paddingHorizontal,
          paddingTop,
        },
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: UI.colors.background,
  },
});
