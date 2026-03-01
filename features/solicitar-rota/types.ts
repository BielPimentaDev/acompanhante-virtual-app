import { ImageSourcePropType } from 'react-native';

export type RouteOptionProps = {
  title: string;
  address: string;
  imageUri: ImageSourcePropType;
  onPress?: () => void;
  selected?: boolean;
};

export type DestinationOption = {
  id: string;
  title: string;
  address: string;
  imageUri: ImageSourcePropType;
  latitude: number;
  longitude: number;
};
