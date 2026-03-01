import { AppButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignSystem } from '@/constants/design-system';
import { RouteOption } from '@/features/solicitar-rota/components/route-option';
import { ROUTE_OPTIONS } from '@/features/solicitar-rota/data/destinations';
import { requestRouteStyles as styles } from '@/features/solicitar-rota/styles/request-route.styles';
import { filterDestinationOptions } from '@/features/solicitar-rota/utils/search';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Switch, TextInput, View } from 'react-native';

export default function RequestRouteScreen() {
  const router = useRouter();
  const routeMapPath = '/rota';
  const [selectedOptionId, setSelectedOptionId] = useState(ROUTE_OPTIONS[0]?.id ?? '');
  const [searchText, setSearchText] = useState('');
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);

  const filteredOptions = useMemo(
    () => filterDestinationOptions(ROUTE_OPTIONS, searchText),
    [searchText]
  );

  useEffect(() => {
    if (filteredOptions.length === 0) {
      setSelectedOptionId('');
      return;
    }

    const hasSelectedVisibleOption = filteredOptions.some((option) => option.id === selectedOptionId);
    if (!hasSelectedVisibleOption) {
      setSelectedOptionId(filteredOptions[0].id);
    }
  }, [filteredOptions, selectedOptionId]);

  const selectedOption = ROUTE_OPTIONS.find((option) => option.id === selectedOptionId) ?? ROUTE_OPTIONS[0];

  const handleStartRoute = () => {
    if (!selectedOption) {
      router.push(routeMapPath);
      return;
    }

    router.push({
      pathname: routeMapPath,
      params: {
        destinationTitle: selectedOption.title,
        destinationLat: String(selectedOption.latitude),
        destinationLng: String(selectedOption.longitude),
        wheelchairAccessible: String(wheelchairAccessible),
      },
    });
  };

  return (
    <ScreenContainer style={[styles.container, { paddingBottom: DesignSystem.spacing.xl }]}>
      <View style={styles.contentContainer}>
        <ScreenHeader title="Solicitar rota" onBack={() => router.back()} style={styles.header} />

        <AppText variant="body" style={styles.description}>
          Selecione qual rota você deseja para chegar ao seu destino.
        </AppText>

        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar destino"
          placeholderTextColor={DesignSystem.colors.textMuted}
        />

        <View style={styles.accessibilityContainer}>
          <View style={styles.accessibilityLabelContainer}>
            <MaterialIcons name="accessible" size={24} color={DesignSystem.colors.textPrimary} />
            <AppText variant="bodyStrong" style={styles.accessibilityText}>
              Viajar com acessibilidade
            </AppText>
          </View>
          <Switch
            value={wheelchairAccessible}
            onValueChange={setWheelchairAccessible}
            trackColor={{ false: DesignSystem.colors.neutralSoft, true: DesignSystem.colors.primarySoft }}
            thumbColor={wheelchairAccessible ? DesignSystem.colors.primary : DesignSystem.colors.surface}
          />
        </View>

        <ScrollView
          style={styles.optionsScroll}
          contentContainerStyle={styles.optionsList}
          showsVerticalScrollIndicator={false}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <RouteOption
                key={option.id}
                title={option.title}
                address={option.address}
                imageUri={option.imageUri}
                selected={selectedOptionId === option.id}
                onPress={() => setSelectedOptionId(option.id)}
              />
            ))
          ) : (
            <AppText variant="body" style={styles.emptyText}>
              Nenhum destino encontrado para essa busca.
            </AppText>
          )}
        </ScrollView>
      </View>

      <AppButton label="Iniciar" onPress={handleStartRoute} />
    </ScreenContainer>
  );
}
