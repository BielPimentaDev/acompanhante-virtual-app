import type { RouteApiResponse } from '@/features/solicitar-rota/types/api-contracts';

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isValidCoordinate(point: unknown): point is { latitude: number; longitude: number } {
  if (!point || typeof point !== 'object') {
    return false;
  }

  const candidate = point as { latitude?: unknown; longitude?: unknown };
  return isFiniteNumber(candidate.latitude) && isFiniteNumber(candidate.longitude);
}

export function isValidRoutePath(path: unknown): path is Array<{ latitude: number; longitude: number }> {
  return Array.isArray(path) && path.length >= 2 && path.every(isValidCoordinate);
}

export function validateRouteResponse(response: unknown): { valid: boolean; error?: string } {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Resposta invalida' };
  }

  const payload = response as Partial<RouteApiResponse>;

  if (payload.success !== true) {
    return { valid: false, error: 'Flag success ausente ou false' };
  }

  if (!isValidRoutePath(payload.coordinates_path)) {
    return { valid: false, error: 'coordinates_path invalido' };
  }

  if (!Array.isArray(payload.path_to_alternative_end_coordinates)) {
    return { valid: false, error: 'path_to_alternative_end_coordinates invalido' };
  }

  if (!payload.path_to_alternative_end_coordinates.every(isValidCoordinate)) {
    return { valid: false, error: 'path_to_alternative_end_coordinates contem pontos invalidos' };
  }

  if (!Array.isArray(payload.path_to_alternative_start_coordinates)) {
    return { valid: false, error: 'path_to_alternative_start_coordinates invalido' };
  }

  if (!payload.path_to_alternative_start_coordinates.every(isValidCoordinate)) {
    return { valid: false, error: 'path_to_alternative_start_coordinates contem pontos invalidos' };
  }

  if (typeof payload.region_name !== 'string' || payload.region_name.trim().length === 0) {
    return { valid: false, error: 'region_name invalido' };
  }

  if (typeof payload.ticket_id !== 'string' || payload.ticket_id.trim().length === 0) {
    return { valid: false, error: 'ticket_id invalido' };
  }

  return { valid: true };
}

export function sanitizeRouteResponse(response: Partial<RouteApiResponse>): RouteApiResponse {
  const coordinatesPath = Array.isArray(response.coordinates_path) ? response.coordinates_path : [];
  const alternativeEnd = Array.isArray(response.path_to_alternative_end_coordinates)
    ? response.path_to_alternative_end_coordinates
    : [];
  const alternativeStart = Array.isArray(response.path_to_alternative_start_coordinates)
    ? response.path_to_alternative_start_coordinates
    : [];

  return {
    ...response,
    coordinates_path: coordinatesPath.filter(isValidCoordinate),
    path_to_alternative_end_coordinates: alternativeEnd.filter(isValidCoordinate),
    path_to_alternative_start_coordinates: alternativeStart.filter(isValidCoordinate),
    region_name: typeof response.region_name === 'string' ? response.region_name.trim() : '',
    success: response.success === true,
    ticket_id: response.ticket_id != null ? String(response.ticket_id).trim() : '',
  };
}
