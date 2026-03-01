import { DestinationOption } from '../types';

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function filterDestinationOptions(options: DestinationOption[], searchText: string) {
  const normalizedSearch = normalizeSearchText(searchText);

  if (!normalizedSearch) {
    return options;
  }

  return options.filter((option) => normalizeSearchText(option.title).includes(normalizedSearch));
}
