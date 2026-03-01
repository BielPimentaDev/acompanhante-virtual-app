import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ComponentProps } from 'react';
import { Text, TextInput } from 'react-native';
import 'react-native-reanimated';

import { DesignSystem } from '@/constants/design-system';

type TextWithDefaultProps = typeof Text & {
  defaultProps?: ComponentProps<typeof Text>;
};

type TextInputWithDefaultProps = typeof TextInput & {
  defaultProps?: ComponentProps<typeof TextInput>;
};

let hasAppliedGlobalInter = false;

function applyGlobalInterFont() {
  if (hasAppliedGlobalInter) {
    return;
  }

  const textComponent = Text as TextWithDefaultProps;
  textComponent.defaultProps = textComponent.defaultProps ?? {};
  textComponent.defaultProps.style = [{ fontFamily: 'Inter_400Regular' }, textComponent.defaultProps.style];

  const textInputComponent = TextInput as TextInputWithDefaultProps;
  textInputComponent.defaultProps = textInputComponent.defaultProps ?? {};
  textInputComponent.defaultProps.style = [
    { fontFamily: 'Inter_400Regular' },
    textInputComponent.defaultProps.style,
  ];

  hasAppliedGlobalInter = true;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  applyGlobalInterFont();

  const appTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: DesignSystem.colors.background,
      card: DesignSystem.colors.background,
    },
  };

  return (
    <ThemeProvider value={appTheme}>
      <Stack screenOptions={{ contentStyle: { backgroundColor: DesignSystem.colors.background } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="solicitar-rota" options={{ headerShown: false }} />
        <Stack.Screen name="rota" options={{ headerShown: false }} />
        <Stack.Screen name="trajeto-concluido" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
