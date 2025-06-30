import { View, Text, StyleSheet, Image, Pressable, ScrollView, FlatList, ActivityIndicator, Platform } from 'react-native'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import FeedbackCard from '../components/FeedbackCard';
import { API_URL } from './HomeScreen';
import { addFavorite, getItem, removeFavorite } from '../utils';
import { analyzePlayerWithAI } from '../utils/gemini';

export default function DetailScreen({ route, navigation }) {
  const { player } = route.params;
  const id = player.id;

  if (!id) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playerDetail, setPlayerDetail] = useState();
  const [isFavorite, setIsFavorite] = useState(false);

  const [feedbacks, setFeedbacks] = useState([]);
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedRank, setSelectedRank] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const listRef = useRef(null);

  const ranks = [...new Set(feedbacks.map((i) => i.rating))];

  const age = useMemo(() => {
    if (!playerDetail?.YoB) return 'N/A';
    return 2025 - playerDetail.YoB;
  }, [playerDetail]);

  const averageRating = useMemo(() => {
    if (!playerDetail?.feedbacks?.length) return '0.0';
    const total = playerDetail.feedbacks.reduce((sum, f) => sum + f.rating, 0);
    return (total / playerDetail.feedbacks.length).toFixed(1);
  }, [playerDetail]);

  const displayedFeedbacks = useMemo(() => {
    return showAllFeedback ? filteredFeedbacks : filteredFeedbacks.slice(0, 5);
  }, [filteredFeedbacks, showAllFeedback])

  const toggleFavorite = async () => {
    const favorites = await getItem('favorites');
    const isAlreadyFavorite = Array.isArray(favorites) && favorites.some((p) => p.id === player.id);

    if (isAlreadyFavorite) {
      await removeFavorite(player.id);
      setIsFavorite(false);
    } else {
      await addFavorite(player);
      setIsFavorite(true);
    }
  };

  const checkFavorite = async () => {
    const favorites = await getItem('favorites');
    if (Array.isArray(favorites)) {
      setIsFavorite(favorites.some((p) => p.id === player.id));
    } else {
      setIsFavorite(false);
    }
  };

  const fetchPlayerDetail = async () => {
    try {
      const url = `${API_URL}/${id}`;
      console.log('🌐 Fetching:', url);

      const res = await fetch(url);
      const data = await res.json();
      setPlayerDetail(data);
      setFeedbacks(data.feedbacks)
      setFilteredFeedbacks(data.feedbacks)
    } catch (error) {
      console.error('Error fetching player:', error);
    }
  };

  const handleFetchData = async () => {
    setIsLoading(true);
    await fetchPlayerDetail();
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPlayerDetail();
    setIsRefreshing(false);
  };

  const fetchAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzePlayerWithAI({
        ...player,
        averageRating,
      });
      setAnalysis(result);
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setAnalysis('⚠️ Unable to analyze player at this time.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const filtered = feedbacks.filter((item) => {
      const matchRank = selectedRank ? item.rating === selectedRank : true;
      return matchRank;
    });

    setFilteredFeedbacks(filtered);
  }, [feedbacks, selectedRank]);

  useEffect(() => {
    if (listRef.current && filteredFeedbacks.length > 0) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [filteredFeedbacks]);

  useEffect(() => {
    handleFetchData();
    checkFavorite();
    fetchAIAnalysis();
  }, [id]);

  if (isLoading || !playerDetail) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <FlatList
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      ref={listRef}
      data={displayedFeedbacks}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <FeedbackCard feedback={item} />}
      initialNumToRender={5}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: player.image }} style={styles.image} />
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.infoHeader}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>PLAYER INFORMATION</Text>
              </View>
              {/* Favorite Icon */}
              <Pressable
                onPress={toggleFavorite}
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
            </View>
            <Text style={styles.name}>{player.playerName}</Text>
            <Text style={styles.team}>{player.team}</Text>
            <Text style={styles.position}>{player.position}</Text>
            {player.isCaptain && (
              <View style={styles.captainRow}>
                <FontAwesome5 name="chess-king" size={16} color="#facc15" style={{ marginRight: 6 }} />
                <Text style={styles.captainText}>Captain</Text>
              </View>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🤖</Text>
              <Text style={styles.sectionTitle}>AI ANALYSIS</Text>
            </View>
            {isAnalyzing ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Text style={styles.analysisText}>{analysis}</Text>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚡</Text>
              <Text style={styles.sectionTitle}>PLAYER STATS</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsScroll}
            >
              <View style={styles.statCard}>
                <View style={styles.statIconCircle}>
                  <Text style={styles.statIcon}>🕒</Text>
                </View>
                <Text style={styles.statValue}>{player.MinutesPlayed}</Text>
                <Text style={styles.statLabel}>Minutes</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconCircle}>
                  <Text style={styles.statIcon}>🎂</Text>
                </View>
                <Text style={styles.statValue}>{age}</Text>
                <Text style={styles.statLabel}>Age</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconCircle}>
                  <Text style={styles.statIcon}>🎯</Text>
                </View>
                <Text style={styles.statValue}>
                  {(player.PassingAccuracy * 100).toFixed(0)}%
                </Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconCircle}>
                  <Text style={styles.statIcon}>⭐</Text>
                </View>
                <Text style={styles.statValue}>{averageRating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </ScrollView>
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.feedbackHeader}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>💬</Text>
                <Text style={styles.sectionTitle}>PLAYER REVIEWS</Text>
              </View>
              <Text style={styles.feedbackCount}>{player.feedbacks.length} comments</Text>
            </View>

            <View style={{ minHeight: 50 }}>
              <FlatList
                horizontal
                data={[null, ...ranks]}
                keyExtractor={(item, index) => (item === null ? 'all' : item)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rankFilterContainer}
                renderItem={({ item }) => {
                  const isSelected = selectedRank === item;
                  const label = item === null ? `All [${averageRating}⭐]` : `${item}⭐`;

                  return (
                    <Pressable
                      style={[
                        styles.teamButton,
                        isSelected ? styles.teamButtonSelected : styles.teamButtonUnselected,
                      ]}
                      onPress={() => setSelectedRank(isSelected ? null : item)}
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
          </View>
        </View>
      }
      ListFooterComponent={
        filteredFeedbacks.length > 5 && (
          <Pressable
            onPress={() => setShowAllFeedback(!showAllFeedback)}
            style={{ paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
              {showAllFeedback ? 'Show Less' : 'Show More'}
            </Text>
          </Pressable>
        )
      }
    />
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
    backgroundColor: '#F3F4F6',
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
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: '2%',
    left: '2%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 999,
    zIndex: 10,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    padding: 6,
    marginBottom: 12,
    borderRadius: 9999,
    backgroundColor: '#EFF6FF',
  },
  favoriteButtonPressed: {
    backgroundColor: '#DBEAFE',
    marginBottom: 12,
    transform: [{ scale: 0.95 }],
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  team: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
    fontWeight: '600'
  },
  position: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  captainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#facc15',
    borderRadius: 999,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(250, 204, 21, 0.1)',
  },
  captainText: {
    fontSize: 14,
    color: '#facc15',
    fontWeight: '600',
  },
  statsScroll: {
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 16,
    // minHeight: 160,
    overflow: 'visible',
  },
  statCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    marginRight: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statIconCircle: {
    backgroundColor: '#E0E7FF',
    padding: 10,
    borderRadius: 50,
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  rankFilterContainer: {
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
  analysisText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    lineHeight: 20,
    textAlign: 'left'
  },
});
