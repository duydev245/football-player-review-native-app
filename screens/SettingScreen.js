import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Alert,
  Pressable,
} from 'react-native'
import { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Heatmap, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

export default function SettingScreen() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);

  const locationData = [
    { latitude: 10.874939144054037, longitude: 106.80049017392408 },
    { latitude: 10.847475179994461, longitude: 106.79190865219202 },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'You need to grant permission to access media library');
      }

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permission denied', 'You need to grant permission to access location');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            image
              ? { uri: image }
              : require('../assets/avatar-placeholder.png') // Thay bằng ảnh mặc định nếu không có
          }
          style={styles.avatar}
        />
        <Pressable style={styles.avatarButton} onPress={pickImage}>
          <Text style={styles.avatarButtonText}>📷 Pick an Avatar</Text>
        </Pressable>

      </View>

      {/* Map */}
      <Text style={styles.subtitle}>Your Location</Text>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="You are here" />
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Getting location...</Text>
      )}
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.874939144054037,
          longitude: 106.80049017392408,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {locationData.map((data, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: data.latitude,
              longitude: data.longitude,
            }}
            title={`Marker ${index + 1}`}
            description={`Weight: ${data.weight}`}
          />
        ))}
        <Polyline
          coordinates={locationData}
          strokeColor="#2563EB"
          strokeWidth={4}
        />
      </MapView> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  loadingText: {
    color: '#6b7280',
    fontStyle: 'italic',
  },
  avatarButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  avatarButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});