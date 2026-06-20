import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    ACTIVE_ROUTE_SESSION_KEY,
    isSessionExpired,
    type RouteSession,
} from '@/features/solicitar-rota/types/session';
import {
    sanitizeRouteResponse,
    validateRouteResponse,
} from '@/features/solicitar-rota/utils/coordinate-converter';

let nativeStorageAvailable: boolean | null = null;
const memoryStorage = new Map<string, string>();

function warnStorageFallback(error: unknown) {
  console.warn('[session-storage] AsyncStorage unavailable, using in-memory fallback.', error);
}

async function storageGetItem(key: string): Promise<string | null> {
  if (nativeStorageAvailable === false) {
    return memoryStorage.get(key) ?? null;
  }

  try {
    const value = await AsyncStorage.getItem(key);
    nativeStorageAvailable = true;
    return value;
  } catch (error) {
    nativeStorageAvailable = false;
    warnStorageFallback(error);
    return memoryStorage.get(key) ?? null;
  }
}

async function storageSetItem(key: string, value: string): Promise<void> {
  if (nativeStorageAvailable === false) {
    memoryStorage.set(key, value);
    return;
  }

  try {
    await AsyncStorage.setItem(key, value);
    nativeStorageAvailable = true;
  } catch (error) {
    nativeStorageAvailable = false;
    warnStorageFallback(error);
    memoryStorage.set(key, value);
  }
}

async function storageRemoveItem(key: string): Promise<void> {
  if (nativeStorageAvailable === false) {
    memoryStorage.delete(key);
    return;
  }

  try {
    await AsyncStorage.removeItem(key);
    nativeStorageAvailable = true;
  } catch (error) {
    nativeStorageAvailable = false;
    warnStorageFallback(error);
    memoryStorage.delete(key);
  }
}

export async function saveSession(session: RouteSession): Promise<void> {
  await storageSetItem(ACTIVE_ROUTE_SESSION_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<RouteSession | null> {
  const raw = await storageGetItem(ACTIVE_ROUTE_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<RouteSession>;

    if (typeof parsed.timestamp_created !== 'number') {
      return null;
    }

    if (isSessionExpired(parsed.timestamp_created)) {
      await clearSession();
      return null;
    }

    const sanitized = sanitizeRouteResponse({
      coordinates_path: parsed.coordinates_path,
      path_to_alternative_end_coordinates: parsed.path_to_alternative_end_coordinates,
      path_to_alternative_start_coordinates: parsed.path_to_alternative_start_coordinates,
      region_name: parsed.region_name,
      success: true,
      ticket_id: parsed.ticket_id,
    });

    const validation = validateRouteResponse(sanitized);

    if (!validation.valid) {
      await clearSession();
      return null;
    }

    if (
      !parsed.destination ||
      typeof parsed.destination.title !== 'string' ||
      typeof parsed.destination.latitude !== 'number' ||
      typeof parsed.destination.longitude !== 'number'
    ) {
      await clearSession();
      return null;
    }

    const progressIndexRaw = typeof parsed.progress_index === 'number' ? parsed.progress_index : 0;
    const progressIndex = Number.isFinite(progressIndexRaw) && progressIndexRaw >= 0
      ? Math.floor(progressIndexRaw)
      : 0;

    return {
      ...(parsed as RouteSession),
      coordinates_path: sanitized.coordinates_path,
      path_to_alternative_end_coordinates: sanitized.path_to_alternative_end_coordinates,
      path_to_alternative_start_coordinates: sanitized.path_to_alternative_start_coordinates,
      region_name: sanitized.region_name,
      ticket_id: sanitized.ticket_id,
      progress_index: progressIndex,
    };
  } catch {
    await clearSession();
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await storageRemoveItem(ACTIVE_ROUTE_SESSION_KEY);
}
