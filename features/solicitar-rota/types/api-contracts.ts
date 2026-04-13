import type { LatLng } from 'react-native-maps';

export type CoordinatePoint = {
  latitude: number;
  longitude: number;
};

export type RouteAlternative = {
  coordinates_path: CoordinatePoint[];
};

export type RouteApiResponse = {
  coordinates_path: CoordinatePoint[];
  path_to_alternative_end_coordinates: CoordinatePoint[];
  path_to_alternative_start_coordinates: CoordinatePoint[];
  region_name: string;
  success: boolean;
  ticket_id: string;
};

export type RouteDestinationSnapshot = {
  title: string;
  latitude: number;
  longitude: number;
};

export function toLatLng(points: CoordinatePoint[]): LatLng[] {
  return points.map((point) => ({ latitude: point.latitude, longitude: point.longitude }));
}
