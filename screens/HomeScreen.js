import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import PlayerCard from '../components/PlayerCard';
import { useFocusEffect } from '@react-navigation/native';
import { addFavorite, getItem, removeFavorite } from '../utils';

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function HomeScreen({ navigation }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [favorites, setFavorites] = useState([]);
    const [players, setPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);

    const [search, setSearch] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);


    const teams = [...new Set(players.map((p) => p.team))];

    const fetchPlayers = async () => {
        try {
            console.log('🌐 Fetching:', API_URL);

            const response = await fetch(API_URL);
            const data = await response.json();
            setPlayers(data);
            setFilteredPlayers(data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

    const fetchFavorites = async () => {
        const data = await getItem('favorites');
        setFavorites(data || []);
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
        await fetchPlayers();
        setIsRefreshing(false);
    };

    const handleFetchData = async () => {
        setIsLoading(true);
        await fetchPlayers();
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    useEffect(() => {
        const filtered = players.filter((player) => {
            const matchSearch = player.playerName.toLowerCase().includes(search.toLowerCase());
            const matchTeam = selectedTeam ? player.team === selectedTeam : true;
            return matchSearch && matchTeam;
        });

        setFilteredPlayers(filtered);
    }, [players, search, selectedTeam]);

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
            <TextInput
                style={styles.searchInput}
                placeholder="Search players..."
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
            />

            {/* team filter */}
            <View style={{ minHeight: 50 }}>
                <FlatList
                    horizontal
                    data={[null, ...teams]}
                    keyExtractor={(item, index) => (item === null ? 'all' : item)}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.teamFilterContainer}
                    renderItem={({ item }) => {
                        const isSelected = selectedTeam === item;
                        const label = item === null ? `All [${teams.length}]` : item;

                        return (
                            <Pressable
                                style={[
                                    styles.teamButton,
                                    isSelected ? styles.teamButtonSelected : styles.teamButtonUnselected,
                                ]}
                                onPress={() => setSelectedTeam(isSelected ? null : item)}
                            >
                                <Text
                                    style={[
                                        styles.teamButtonText,
                                        isSelected ? styles.teamButtonTextSelected : styles.teamButtonTextUnselected,
                                    ]}
                                >
                                    {label}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </View>


            <FlatList
                key={'2-cols'}
                data={filteredPlayers}
                numColumns={2}
                contentContainerStyle={{
                    paddingBottom: 12,
                }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PlayerCard
                        player={item}
                        navigation={navigation}
                        isFavorite={isPlayerFavorite(item.id)}
                        onToggleFavorite={() => handleToggleFavorite(item)}
                        isFavoriteScreen={false}
                    />
                )}
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
        padding: 8
    },
    searchInput: {
        marginHorizontal: '1%',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    teamFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        gap: 8,
        marginHorizontal: '1%',
    },
    teamButton: {
        display: 'flex',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    teamButtonSelected: {
        backgroundColor: '#2563EB',
    },
    teamButtonUnselected: {
        backgroundColor: '#f3f4f6',
    },
    teamButtonText: {
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#1f2937',
        textAlign: 'center'
    },
    teamButtonTextSelected: {
        color: '#ffffff',
    },
    teamButtonTextUnselected: {
        color: '#1f2937',
    },
});