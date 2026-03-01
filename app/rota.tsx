import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, type LatLng } from 'react-native-maps';

import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignSystem } from '@/constants/design-system';

const DEFAULT_DESTINATION: LatLng = {
  latitude: -22.89797466068651,
  longitude: -43.1321440755836,
};

const DEFAULT_DESTINATION_TITLE = 'Portão principal';
const ARRIVAL_DISTANCE_METERS = 1;
const MAP_ZOOM_DELTA = 0.001;

const INITIAL_REGION = {
  latitude: -22.9038056,
  longitude: -43.12075,
  latitudeDelta: MAP_ZOOM_DELTA,
  longitudeDelta: MAP_ZOOM_DELTA,
};

function getDistanceMeters(from: LatLng, to: LatLng) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadius = 6371000;
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

export default function RouteMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destinationTitle?: string;
    destinationLat?: string;
    destinationLng?: string;
  }>();
  const mapRef = useRef<MapView | null>(null);
  const routeFetchInProgress = useRef(false);
  const lastRouteFetchTs = useRef(0);
  const hasNavigatedToCompletion = useRef(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);

  const destination = useMemo<LatLng>(() => {
    const lat = Number(params.destinationLat);
    const lng = Number(params.destinationLng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return DEFAULT_DESTINATION;
    }

    return { latitude: lat, longitude: lng };
  }, [params.destinationLat, params.destinationLng]);

  const destinationTitle =
    typeof params.destinationTitle === 'string' && params.destinationTitle.length > 0
      ? params.destinationTitle
      : DEFAULT_DESTINATION_TITLE;

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setPermissionDenied(true);
        setLoadingLocation(false);
        return;
      }

      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        const current = {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
        setUserLocation(current);
        mapRef.current?.animateToRegion(
          {
            ...current,
            latitudeDelta: MAP_ZOOM_DELTA,
            longitudeDelta: MAP_ZOOM_DELTA,
          },
          600
        );
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1200,
          distanceInterval: 3,
        },
        (position) => {
          const current = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(current);
          mapRef.current?.animateToRegion(
            {
              ...current,
              latitudeDelta: MAP_ZOOM_DELTA,
              longitudeDelta: MAP_ZOOM_DELTA,
            },
            700
          );
        }
      );

      setLoadingLocation(false);
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!userLocation) {
      return;
    }

    const now = Date.now();
    if (routeFetchInProgress.current || now - lastRouteFetchTs.current < 2500) {
      return;
    }

    routeFetchInProgress.current = true;
    lastRouteFetchTs.current = now;

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const coordinates = data?.routes?.[0]?.geometry?.coordinates;

        if (!Array.isArray(coordinates) || coordinates.length === 0) {
          return;
        }

        const mapped: LatLng[] = coordinates
          .filter((item: unknown): item is [number, number] => Array.isArray(item) && item.length >= 2)
          .map(([longitude, latitude]) => ({ latitude, longitude }));

        if (mapped.length > 0) {
          setRouteCoordinates(mapped);
        }
      } catch {
        setRouteCoordinates([userLocation, destination]);
      } finally {
        routeFetchInProgress.current = false;
      }
    };

    fetchRoute();
  }, [destination, userLocation]);

  const polylinePoints = useMemo(() => {
    if (!userLocation) {
      return [];
    }

    if (routeCoordinates.length > 0) {
      return routeCoordinates;
    }

    return [userLocation, destination];
  }, [destination, routeCoordinates, userLocation]);

  const distanceMeters = useMemo(() => {
    if (!userLocation) {
      return null;
    }

    return getDistanceMeters(userLocation, destination);
  }, [destination, userLocation]);

  useEffect(() => {
    if (distanceMeters === null || hasNavigatedToCompletion.current) {
      return;
    }

    if (distanceMeters <= ARRIVAL_DISTANCE_METERS) {
      hasNavigatedToCompletion.current = true;
      router.replace('/trajeto-concluido');
    }
  }, [distanceMeters, router]);

  return (
    <ScreenContainer style={styles.container} paddingHorizontal={0}>
      <ScreenHeader
        title="Navegação"
        onBack={() => router.back()}
        style={styles.header}
        titleStyle={styles.headerTitle}
      />

      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          followsUserLocation
          showsCompass
          showsMyLocationButton
          loadingEnabled>
          <Marker coordinate={destination} title={destinationTitle} description="Destino selecionado" />

          {polylinePoints.length > 0 && (
            <Polyline coordinates={polylinePoints} strokeColor="#2D66A2" strokeWidth={6} />
          )}
        </MapView>

        {loadingLocation && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={DesignSystem.colors.info} />
            <AppText variant="caption" style={styles.loadingText}>
              Buscando sua localização...
            </AppText>
          </View>
        )}

        {permissionDenied && (
          <View style={styles.loadingOverlay}>
            <AppText variant="bodyStrong" style={styles.errorTitle}>
              Permissão de localização negada
            </AppText>
            <AppText variant="caption" style={styles.errorText}>
              Ative a localização para atualizar a rota automaticamente enquanto você se locomove.
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.bottomCard}>
        <AppText variant="bodyStrong" style={styles.cardTitle}>
          Destino: {destinationTitle}
        </AppText>
        <AppText variant="caption" style={styles.cardCoords}>
          {destination.latitude.toFixed(6)}, {destination.longitude.toFixed(6)}
        </AppText>
        <AppText variant="caption" style={styles.cardInfo}>
          {distanceMeters === null
            ? 'Aguardando posição atual...'
            : `Distância aproximada: ${(distanceMeters / 1000).toFixed(2)} km`}
        </AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: DesignSystem.spacing.xl,
  },
  headerTitle: {
    color: DesignSystem.colors.textPrimary,
  },
  mapWrap: {
    flex: 1,
    marginTop: DesignSystem.spacing.sm,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    paddingHorizontal: 26,
  },
  loadingText: {
    marginTop: 12,
    color: '#1E3650',
  },
  errorTitle: {
    color: '#1E3650',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#38495B',
  },
  bottomCard: {
    backgroundColor: DesignSystem.colors.surface,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.borderSubtle,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  cardTitle: {
    color: '#152535',
  },
  cardCoords: {
    marginTop: 4,
    color: '#516476',
  },
  cardInfo: {
    marginTop: 6,
    paddingBottom: 12,    color: DesignSystem.colors.info,
  },
});
