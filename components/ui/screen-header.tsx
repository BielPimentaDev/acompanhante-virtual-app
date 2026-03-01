import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { UI } from '@/constants/ui';

import { AppText } from './app-text';

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function ScreenHeader({ title, onBack, style, titleStyle }: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.backButton} onPress={onBack} hitSlop={8}>
        <Ionicons name="arrow-back" size={22} color={UI.colors.text} />
      </Pressable>
      <AppText variant="bodyStrong" style={[styles.title, titleStyle]}>
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: UI.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    color: UI.colors.text,
  },
});
