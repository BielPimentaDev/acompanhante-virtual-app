import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { DesignSystem } from '@/constants/design-system';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.topArea}>
        <AppText variant="title" style={styles.title}>
          ACOMPANHANTE VIRTUAL
        </AppText>
        <AppText variant="subtitle" color={DesignSystem.colors.accent}>
          Você em segurança
        </AppText>
      </View>

      <Image source={require("@/assets/images/placeholder.png")} style={styles.image} />

      <AppButton label="Solicitar acompanhamento" onPress={() => router.push('/solicitar-rota')} />

      <Image source={require("@/assets/images/uff.png")} style={styles.brandImage} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: DesignSystem.spacing.xl,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 420,
  },
  topArea: {
    alignItems: 'center',
    marginTop: DesignSystem.spacing.md,
  },
  title: {
    textAlign: 'center',
  },
  illustrationWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationCard: {
    width: '100%',
    maxWidth: 320,
    height: 300,
    backgroundColor: '#EEF2F8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  person: {
    position: 'absolute',
    right: 38,
    bottom: 50,
  },
  brandContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brand: {
    color: '#0F5DA4',
    fontWeight: '800',
    fontSize: 44,
    letterSpacing: 1,
    textTransform: 'lowercase',
  },
  brandImage: {
    width: 80,
    height: 40,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
