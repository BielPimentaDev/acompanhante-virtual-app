import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { DesignSystem } from '@/constants/design-system';

export default function RouteCompletedScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="check" size={52} color={DesignSystem.colors.surface} />
        </View>

        <AppText variant="sectionTitle" style={styles.title}>
          Você concluiu o seu trajeto
        </AppText>

        <Image
          source={require('@/assets/images/celebration.png')}
          style={styles.illustration}
          contentFit="contain"
        />

        <AppText variant="subtitle" color={DesignSystem.colors.accent} style={styles.subtitle}>
          Confirme que você chegou em segurança
        </AppText>
      </View>

      <AppButton label="Confirmar" onPress={() => router.replace('/home')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: DesignSystem.spacing.xl,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: DesignSystem.radius.full,
    backgroundColor: DesignSystem.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: DesignSystem.spacing.xl,
    textAlign: 'center',
    color: DesignSystem.colors.textPrimary,
  },
  illustration: {
    marginTop: 34,
    width: '100%',
    height: 310,
  },
  subtitle: {
    marginTop: 30,
    textAlign: 'center',
    maxWidth: 280,
  },
});