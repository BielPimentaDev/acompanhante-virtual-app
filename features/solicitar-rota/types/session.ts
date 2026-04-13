import type { CoordinatePoint, RouteDestinationSnapshot } from '@/features/solicitar-rota/types/api-contracts';

export const ACTIVE_ROUTE_SESSION_KEY = 'route_session_active';
const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;

export type RouteSession = {
  ticket_id: string;
  destination: RouteDestinationSnapshot;
  coordinates_path: CoordinatePoint[];
  path_to_alternative_end_coordinates: CoordinatePoint[];
  path_to_alternative_start_coordinates: CoordinatePoint[];
  region_name: string;
  timestamp_created: number;
};

export function isSessionExpired(timestampCreated: number) {
  return Date.now() - timestampCreated > FIVE_HOURS_IN_MS;
}
