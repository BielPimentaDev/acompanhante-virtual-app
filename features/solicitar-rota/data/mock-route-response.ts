import { FIXED_ROUTE_COORDINATES_PATH } from '@/features/solicitar-rota/data/mock-fixed-route';
import type {
    RouteApiResponse,
    RouteDestinationSnapshot,
} from '@/features/solicitar-rota/types/api-contracts';

const DEFAULT_REGION_NAME = 'Gragoata';

export function buildMockRouteResponse(
  _userLocation: { latitude: number; longitude: number },
  destination: RouteDestinationSnapshot,
  ticketId?: string
): RouteApiResponse {
  void destination;

  return {
    coordinates_path: FIXED_ROUTE_COORDINATES_PATH,
    path_to_alternative_end_coordinates: [],
    path_to_alternative_start_coordinates: [],
    region_name: DEFAULT_REGION_NAME,
    success: true,
    ticket_id: ticketId ?? `ticket_${Date.now()}`,
  };
}
