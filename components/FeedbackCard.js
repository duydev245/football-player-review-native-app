import { FontAwesome } from '@expo/vector-icons'
import { View, Text, StyleSheet } from 'react-native'

export default function FeedbackCard({ feedback }) {

  const formattedDate = new Date(feedback.date).toLocaleDateString()

  const renderStars = (count) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name="star"
          size={16}
          color={i < count ? '#facc15' : '#e5e7eb'}
        />
      )
    }
    return stars
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {/* Avatar letter */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {feedback.author.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Name + Date */}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{feedback.author}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{feedback.rating}/5</Text>
        </View>
      </View>

      {/* Stars */}
      <View style={styles.stars}>{renderStars(feedback.rating)}</View>

      {/* Comment */}
      <Text style={styles.comment}>{feedback.comment}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    backgroundColor: '#6366f1',
    borderRadius: 999,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  ratingBadge: {
    backgroundColor: '#facc15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    color: '#111827',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 5
  },
  comment: {
    fontStyle: 'italic',
    color: '#374151',
    fontSize: 14,
  },
})
