import type { RouteApiResponse, RouteDestinationSnapshot } from '@/features/solicitar-rota/types/api-contracts';
import {
    sanitizeRouteResponse,
    validateRouteResponse,
} from '@/features/solicitar-rota/utils/coordinate-converter';
import type { LatLng } from 'react-native-maps';

const API_URL = 'http://192.168.47.19/api/backend/Dispatch';
const DEFAULT_USER = 'usuario_cadastrado_mobile@gmail.com';

export async function fetchRoute(
  userLocation: LatLng,
  destination: RouteDestinationSnapshot,
  user = DEFAULT_USER,
): Promise<RouteApiResponse> {
  const body = {
    coordenadas_atual: [userLocation.latitude, userLocation.longitude],
    coordenadas_destino: [destination.latitude, destination.longitude],
    user,
  };

  console.log('[fetchRoute] POST', API_URL, JSON.stringify(body));

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Type': 'PluginAcompanhante',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error('[fetchRoute] Erro HTTP', response.status);
    throw new Error(`API error: ${response.status}`);
  }

  const json = await response.json();
  console.log('[fetchRoute] Resposta', JSON.stringify(json));
  const sanitized = sanitizeRouteResponse(json);
  const validation = validateRouteResponse(sanitized);

  if (!validation.valid) {
    throw new Error(validation.error ?? 'Falha ao montar resposta de rota');
  }

  return sanitized;
}
