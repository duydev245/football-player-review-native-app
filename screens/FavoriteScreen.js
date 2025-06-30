import { View, Text, StyleSheet, TextInput, Pressable, Alert, FlatList, ActivityIndicator } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { getItem, removeFavorite, clearItem, addFavorite, setItem } from '../utils';
import PlayerCard from '../components/PlayerCard';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoriteScreen({ navigation }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchFavorites = async () => {
    const data = await getItem('favorites');
    setFavorites(data || []);
    setFilteredFavorites(data || []);
  };

  const isPlayerFavorite = (playerId) => favorites.some(p => p.id === playerId);

  const handleToggleFavorite = async (player) => {
    const exists = favorites.some(p => p.id === player.id);
    let updatedFavorites;
    if (exists) {
      await removeFavorite(player.id);
      updatedFavorites = favorites.filter(p => p.id !== player.id);
    } else {
      await addFavorite(player);
      updatedFavorites = [...favorites, player];
    }
    setFavorites(updatedFavorites);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFavorites();
    setIsRefreshing(false);
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    await fetchFavorites();
    setIsLoading(false);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Remove All Favorites',
      'This will remove all players from your favorites. Do you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove All',
          style: 'destructive',
          onPress: async () => {
            await clearItem('favorites');
            fetchFavorites()
            setEditMode(false);
            setSelectedIds([]);
          },
        },
      ]);
  };

  const handleDeleteSelected = async () => {
    Alert.alert(
      'Remove Selected',
      'Are you sure you want to remove the selected players from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = favorites.filter((p) => !selectedIds.includes(p.id));
            await setItem('favorites', updated);
            setFavorites(updated);
            setFilteredFavorites(updated);
            setSelectedIds([]);
            setEditMode(false);
          },
        },
      ]
    );
  };

  const handleLongPressCard = () => {
    setEditMode(true);
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  useEffect(() => {
    const filtered = favorites.filter((player) =>
      player.playerName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredFavorites(filtered);
  }, [favorites, search]);

  useEffect(() => {
    handleFetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredFavorites.length > 0 && (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
          {
            editMode ? (
              <View style={styles.actionButtons}>
                {selectedIds.length > 0 ? (
                  <Pressable
                    style={[styles.clearButton, { backgroundColor: '#ef4444' }]}
                    onPress={handleDeleteSelected}
                  >
                    <Text style={styles.clearButtonText}>Remove Selected [{selectedIds.length}]</Text>
                  </Pressable>
                ) : (
                  <Pressable style={[styles.clearButton, { backgroundColor: '#ef4444' }]} onPress={handleClearAll}>
                    <Text style={styles.clearButtonText}>Remove All</Text>
                  </Pressable>
                )}
                <Pressable style={[styles.clearButton, { backgroundColor: '#2563EB' }]} onPress={() => setEditMode(false)}>
                  <Text style={styles.clearButtonText}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.onEditModeText}>Long press a card to enter edit mode</Text>
            )
          }
        </>
      )}

      <FlatList
        key={'2-cols'}
        data={filteredFavorites}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            navigation={navigation}
            isFavorite={isPlayerFavorite(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            isFavoriteScreen={true}

            isEditMode={editMode}
            isSelected={selectedIds.includes(item.id)}
            onSelect={() => toggleSelect(item.id)}
            onLongPressCard={handleLongPressCard}
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No favorite players found.</Text>}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 12,
  },
  searchInput: {
    marginHorizontal: '1%',
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  rowWrapper: {
    justifyContent: 'space-between',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'flex-end',
    gap: 5
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  onEditModeText: {
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 12,
    fontSize: 16,
    fontStyle: 'italic'
  },
})