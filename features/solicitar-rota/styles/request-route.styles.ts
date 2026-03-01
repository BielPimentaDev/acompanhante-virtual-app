import { StyleSheet } from 'react-native';

import { DesignSystem } from '@/constants/design-system';

export const requestRouteStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: DesignSystem.spacing.xl,
  },
  title: {
    marginTop: DesignSystem.spacing.md,
  },
  description: {
    marginTop: DesignSystem.spacing.md,
    color: DesignSystem.colors.textPrimary,
    maxWidth: 510,
  },
  searchInput: {
    marginTop: 18,
    height: 52,
    borderRadius: DesignSystem.radius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border,
    backgroundColor: DesignSystem.colors.surface,
    paddingHorizontal: 14,
    fontSize: DesignSystem.typography.body,
    color: DesignSystem.colors.textPrimary,
  },
  accessibilityContainer: {
    marginTop: 14,
    backgroundColor: DesignSystem.colors.surface,
    borderRadius: DesignSystem.radius.md,
    borderWidth: 1,
    borderColor: DesignSystem.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  accessibilityLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accessibilityText: {
    color: DesignSystem.colors.textPrimary,
  },
  contentContainer: {
    flex: 1,
  },
  optionsScroll: {
    marginTop: 18,
    flex: 1,
  },
  optionsList: {
    gap: 22,
    paddingBottom: 12,
  },
  emptyText: {
    color: DesignSystem.colors.textSecondary,
    textAlign: 'center',
    marginTop: 18,
  },
});
