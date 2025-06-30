import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

export default function PlayerCard({ player, navigation, isFavorite, onToggleFavorite, isFavoriteScreen, isEditMode, isSelected, onSelect, onLongPressCard }) {
  const minutesToHours = (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

  const handleNavigate = () => {
    navigation.navigate('DetailScreen', { player });
  };

  const handleRemove = () => {
    Alert.alert('Remove', 'Remove this player from favorites?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onToggleFavorite(player) },
    ]);
  };

  return (
    <Pressable
      style={styles.cardContainer}
      onPress={isEditMode ? onSelect : handleNavigate}
      onLongPress={onLongPressCard}
    >
      {/* Avatar Image */}
      {isFavoriteScreen ? (
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: player.image }}
            style={styles.image}
          />
          <Pressable
            onPress={handleRemove}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>
              <MaterialIcons name="delete" size={20} color="#fff" />
            </Text>
          </Pressable>

          {isEditMode && (
            <View style={styles.selectIconWrapper}>
              <MaterialIcons
                name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
                size={20}
                // color={isSelected ? '#2563EB' : '#fff'}
                color='#2563EB'
              />
            </View>
          )}
        </View>
      ) : (
        <Image
          source={{ uri: player.image }}
          style={styles.image}
        />
      )}

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.playerName} numberOfLines={2} ellipsizeMode='tail'>{player.playerName}</Text>

          <View style={styles.positionContainer}>
            <Text style={styles.position}>{player.position}</Text>
            {player.isCaptain && <Text style={styles.captainStar}>⭐</Text>}
          </View>

          <Text style={styles.minutes}>
            {minutesToHours(player.MinutesPlayed)}
          </Text>
          <Text style={styles.passing}>
            Passing: {(player.PassingAccuracy * 100).toFixed(1)}%
          </Text>
        </View>

        {/* Favorite Icon */}
        {!isFavoriteScreen && (
          <Pressable
            onPress={onToggleFavorite}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && styles.favoriteButtonPressed,
            ]}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={28}
              color={isFavorite ? '#ef4444' : '#9ca3af'}
            />
          </Pressable>
        )
        }
      </View >
    </Pressable >
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    marginHorizontal: '1%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  position: {
    fontSize: 14,
    color: '#4B5563',
  },
  captainStar: {
    color: '#2563EB',
    marginLeft: 4,
  },
  minutes: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 4,
  },
  passing: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 9999,
    backgroundColor: '#EFF6FF',
  },
  favoriteButtonPressed: {
    backgroundColor: '#DBEAFE',
    transform: [{ scale: 0.95 }],
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(239,68,68,0.9)', // đỏ hơi trong
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectIconWrapper: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
});
