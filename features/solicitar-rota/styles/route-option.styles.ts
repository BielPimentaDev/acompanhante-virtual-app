import { StyleSheet } from 'react-native';

import { DesignSystem } from '@/constants/design-system';

export const routeOptionStyles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flex: 1,
    paddingRight: 16,
  },
  optionTitle: {
    color: DesignSystem.colors.textPrimary,
    marginBottom: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionImage: {
    width: 96,
    height: 96,
    borderRadius: DesignSystem.radius.lg,
    marginRight: 14,
    backgroundColor: DesignSystem.colors.border,
  },
  optionAddress: {
    flex: 1,
    color: DesignSystem.colors.textSecondary,
  },
  radioOuter: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: DesignSystem.colors.neutral,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    backgroundColor: DesignSystem.colors.neutralSoft,
  },
  radioInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: DesignSystem.colors.info,
  },
});
