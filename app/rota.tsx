import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, type LatLng } from 'react-native-maps';

import { AppButton } from '@/components/ui/app-button';
import { AppText } from '@/components/ui/app-text';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { DesignSystem } from '@/constants/design-system';
import { fetchRoute } from '@/features/solicitar-rota/services/route-service';
import {
  clearSession,
  loadSession,
  saveSession,
} from '@/features/solicitar-rota/services/session-storage';
import type { CoordinatePoint, RouteDestinationSnapshot } from '@/features/solicitar-rota/types/api-contracts';
import type { RouteSession } from '@/features/solicitar-rota/types/session';

const DEFAULT_DESTINATION: LatLng = {
  latitude: -22.89797466068651,
  longitude: -43.1321440755836,
};

const DEFAULT_DESTINATION_TITLE = 'Portão principal';
const ARRIVAL_DISTANCE_METERS = 5;
const MAP_ZOOM_DELTA = 0.001;
const PROGRESS_DISTANCE_THRESHOLD_METERS = 15;
const PROGRESS_LOOKAHEAD_POINTS = 30;

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

function findClosestCoordinateIndex(
  points: CoordinatePoint[],
  current: LatLng,
  startIndex: number,
  lookahead: number
) {
  const clampedStart = Math.max(0, Math.floor(startIndex));
  const clampedEnd = Math.min(points.length - 1, clampedStart + Math.max(1, lookahead));
  let closestIndex = clampedStart;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let i = clampedStart; i <= clampedEnd; i += 1) {
    const distance = getDistanceMeters(current, points[i]);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return { index: closestIndex, distance: closestDistance };
}

export default function RouteMapScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    destinationTitle?: string;
    destinationLat?: string;
    destinationLng?: string;
  }>();
  const mapRef = useRef<MapView | null>(null);
  const hasNavigatedToCompletion = useRef(false);
  const routeSessionRef = useRef<RouteSession | null>(null);
  const routeSessionInitInProgress = useRef(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeRefreshKey, setRouteRefreshKey] = useState(0);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [routeSession, setRouteSession] = useState<RouteSession | null>(null);

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

  const destinationSnapshot = useMemo<RouteDestinationSnapshot>(
    () => ({
      title: destinationTitle,
      latitude: destination.latitude,
      longitude: destination.longitude,
    }),
    [destination, destinationTitle]
  );

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
    if (permissionDenied) {
      setLoadingRoute(false);
      setRouteError('Ative a localização para iniciar o trajeto.');
      return;
    }

    if (routeSessionRef.current || routeSessionInitInProgress.current) {
      return;
    }

    if (!userLocation) {
      return;
    }

    let active = true;
    routeSessionInitInProgress.current = true;

    const initializeRouteSession = async () => {
      setLoadingRoute(true);
      setRouteError(null);

      try {
        const restored = await loadSession();

        if (
          restored &&
          restored.destination.latitude === destinationSnapshot.latitude &&
          restored.destination.longitude === destinationSnapshot.longitude
        ) {
          routeSessionRef.current = restored;
          setRouteSession(restored);

          if (restored.coordinates_path.length > 0) {
            setTimeout(() => {
              mapRef.current?.fitToCoordinates(restored.coordinates_path, {
                edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
                animated: true,
              });
            }, 400);
          }

          return;
        }

        if (restored) {
          await clearSession();
        }

        const response = await fetchRoute(userLocation, destinationSnapshot);
        const nextSession: RouteSession = {
          ticket_id: response.ticket_id,
          destination: destinationSnapshot,
          coordinates_path: response.coordinates_path,
          path_to_alternative_end_coordinates: response.path_to_alternative_end_coordinates,
          path_to_alternative_start_coordinates: response.path_to_alternative_start_coordinates,
          region_name: response.region_name,
          progress_index: 0,
          timestamp_created: Date.now(),
        };

        await saveSession(nextSession);

        routeSessionRef.current = nextSession;
        setRouteSession(nextSession);

        if (response.coordinates_path.length > 0) {
          setTimeout(() => {
            mapRef.current?.fitToCoordinates(response.coordinates_path, {
              edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
              animated: true,
            });
          }, 400);
        }
      } catch {
        if (active) {
          setRouteError('Nao foi possivel carregar a rota.');
        }
      } finally {
        routeSessionInitInProgress.current = false;
        setLoadingRoute(false);
      }
    };

    initializeRouteSession();

    return () => {
      active = false;
    };
  }, [destinationSnapshot, permissionDenied, routeRefreshKey, userLocation]);

  const handleRetryRoute = () => {
    routeSessionRef.current = null;
    routeSessionInitInProgress.current = false;
    setRouteSession(null);
    setRouteError(null);
    setRouteRefreshKey((current) => current + 1);
  };

  const polylinePoints = useMemo(() => {
    if (routeSession?.coordinates_path && routeSession.coordinates_path.length > 0) {
      const rawIndex = routeSession.progress_index ?? 0;
      const clampedIndex = Math.min(
        Math.max(0, Math.floor(rawIndex)),
        routeSession.coordinates_path.length - 1
      );

      return routeSession.coordinates_path.slice(clampedIndex);
    }

    if (!userLocation || loadingRoute) {
      return [];
    }

    return [userLocation, destination];
  }, [destination, loadingRoute, routeSession, userLocation]);

  const distanceMeters = useMemo(() => {
    if (!userLocation) {
      return null;
    }

    return getDistanceMeters(userLocation, destination);
  }, [destination, userLocation]);

  useEffect(() => {
    if (!userLocation || !routeSession?.coordinates_path?.length) {
      return;
    }

    const currentIndex = routeSession.progress_index ?? 0;
    const { index: closestIndex, distance } = findClosestCoordinateIndex(
      routeSession.coordinates_path,
      userLocation,
      currentIndex,
      PROGRESS_LOOKAHEAD_POINTS
    );

    if (distance > PROGRESS_DISTANCE_THRESHOLD_METERS) {
      return;
    }

    if (closestIndex <= currentIndex) {
      return;
    }

    const clampedIndex = Math.min(closestIndex, routeSession.coordinates_path.length - 1);
    const updatedSession = {
      ...routeSession,
      progress_index: clampedIndex,
    };

    routeSessionRef.current = updatedSession;
    setRouteSession(updatedSession);
    saveSession(updatedSession).catch(() => null);
  }, [routeSession, userLocation]);

  useEffect(() => {
    if (distanceMeters === null || hasNavigatedToCompletion.current) {
      return;
    }

    if (distanceMeters <= ARRIVAL_DISTANCE_METERS) {
      hasNavigatedToCompletion.current = true;
      clearSession().finally(() => {
        router.replace('/trajeto-concluido');
      });
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

        {!loadingLocation && loadingRoute && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={DesignSystem.colors.info} />
            <AppText variant="caption" style={styles.loadingText}>
              Carregando rota...
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

        {!permissionDenied && !loadingRoute && routeError && (
          <View style={styles.loadingOverlay}>
            <AppText variant="bodyStrong" style={styles.errorTitle}>
              Falha ao carregar rota
            </AppText>
            <AppText variant="caption" style={styles.errorText}>
              {routeError}
            </AppText>
            <AppButton label="Tentar novamente" onPress={handleRetryRoute} style={styles.retryButton} />
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
  retryButton: {
    marginTop: 16,
    width: 180,
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
