import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native'

type Props = {
  uri?: string | null
  style?: ImageStyle | ViewStyle | (ImageStyle | ViewStyle)[]
}

export function ImageWithPlaceholder({ uri, style }: Props) {
  if (!uri) {
    return <View style={[styles.placeholder, style as ViewStyle]} />
  }

  return (
    <Image source={{ uri }} style={[styles.image, style as ImageStyle]} resizeMode="cover" />
  )
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: '#f0f0f0', borderRadius: 8 },
  image: { borderRadius: 8 }
})
