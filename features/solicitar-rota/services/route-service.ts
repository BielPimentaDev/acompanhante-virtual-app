import { buildMockRouteResponse } from '@/features/solicitar-rota/data/mock-route-response';
import type { RouteApiResponse, RouteDestinationSnapshot } from '@/features/solicitar-rota/types/api-contracts';
import {
    sanitizeRouteResponse,
    validateRouteResponse,
} from '@/features/solicitar-rota/utils/coordinate-converter';
import type { LatLng } from 'react-native-maps';

const MOCK_FAILURE_RATE = 0;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchRoute(
  userLocation: LatLng,
  destination: RouteDestinationSnapshot,
  ticketId?: string
): Promise<RouteApiResponse> {
  const latencyMs = 1000 + Math.floor(Math.random() * 500);
  await wait(latencyMs);

  if (Math.random() < MOCK_FAILURE_RATE) {
    throw new Error('Falha simulada na API de rota');
  }

  const response = buildMockRouteResponse(userLocation, destination, ticketId);

  const sanitized = sanitizeRouteResponse(response);
  const validation = validateRouteResponse(sanitized);

  if (!validation.valid) {
    throw new Error(validation.error ?? 'Falha ao montar resposta de rota');
  }

  return sanitized;
}
