import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { DesignSystem } from '@/constants/design-system';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/home');
    }, 1800);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <ScreenContainer style={styles.container}>

      <View style={styles.contentCenter}>
        <Image source={require('@/assets/images/splash-icon.png')} style={styles.logo} contentFit="contain" />

        <AppText variant="title" style={styles.title}>
          ACOMPANHANTE VIRTUAL
        </AppText>
        <AppText variant="subtitle" color={DesignSystem.colors.accent} style={styles.subtitle}>
          Você em segurança
        </AppText>
      </View>

      <View style={styles.brandContainer}>
        <AppText style={styles.brand}>uff</AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: DesignSystem.spacing.xl,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: DesignSystem.spacing.xs,
    textAlign: 'center',
  },
  brandContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    color: DesignSystem.colors.primary,
    fontWeight: '800',
    fontSize: 44,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
});
