import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { routeOptionStyles } from '../styles/route-option.styles';
import { RouteOptionProps } from '../types';

export function RouteOption({ title, address, imageUri, onPress, selected = false }: RouteOptionProps) {
  return (
    <TouchableOpacity style={routeOptionStyles.optionContainer} activeOpacity={0.85} onPress={onPress}>
      <View style={routeOptionStyles.optionLeft}>
        <AppText variant="subtitle" style={routeOptionStyles.optionTitle}>
          {title}
        </AppText>

        <View style={routeOptionStyles.optionContent}>
          <Image source={imageUri} style={routeOptionStyles.optionImage} contentFit="cover" />
          <AppText variant="body" style={routeOptionStyles.optionAddress}>
            {address}
          </AppText>
        </View>
      </View>

      <View style={[routeOptionStyles.radioOuter, selected && routeOptionStyles.radioOuterActive]}>
        {selected && <View style={routeOptionStyles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}
