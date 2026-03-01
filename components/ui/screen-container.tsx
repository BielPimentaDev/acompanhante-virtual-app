import { DesignSystem } from '@/constants/design-system';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noHorizontalPadding?: boolean;
  topSpacing?: boolean;
};

export function ScreenContainer({
  children,
  style,
  noHorizontalPadding = false,
  topSpacing = true,
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.base,
        !noHorizontalPadding ? styles.horizontalPadding : null,
        topSpacing ? styles.topSpacing : null,
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: DesignSystem.colors.background,
  },
  horizontalPadding: {
    paddingHorizontal: DesignSystem.spacing.xl,
  },
  topSpacing: {
    paddingTop: DesignSystem.spacing.md,
  },
});
