import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Button
} from 'react-native';

//home page where user sees their workouts for the week.
export default function HomeScreen() {
  const weekStart = '4/21/2025'; //harcdoded for now, need to change this to be dynamic
  const initialDays = [
    {
      name: 'Monday',
      lifts: { squat: 545, bench: 545, deads: 545 },
      comments: [],
    },
    {
      name: 'Tuesday',
      lifts: { squat: 545, bench: 545, deads: 545 },
      comments: [
        'Squat was okay, misgrooved second',
        'Bench was a bit off, need to work on form',
      ],
    },
    // add more days here...
  ];

  interface Day {
    name: string;
    lifts: {
      squat: number;
      bench: number;
      deads: number;
    };
    comments: string[];
  }

  const [days, setDays] = useState<Day []>(initialDays);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const handleCommentChange = (dayName: string, text: string): void => {
    setCommentInputs((prev) => ({ ...prev, [dayName]: text }));
  };

  const addComment = (dayName: string) => {
    const newComment = commentInputs[dayName]?.trim();
    if (!newComment) return;
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.name === dayName
          ? { ...day, comments: [...day.comments, newComment] }
          : day
      )
    );
    setCommentInputs((prev) => ({ ...prev, [dayName]: '' }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Week of {weekStart}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {days.map((day) => (
          <View key={day.name} style={styles.card}>
            <View style={styles.cardLeft}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80' }}
                style={styles.thumbnail}
              />
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.dayTitle}>{day.name}</Text>
              <View style={styles.liftRow}>
                <Text style={styles.liftLabel}>Squat</Text>
                <Text style={styles.liftLabel}>Bench</Text>
                <Text style={styles.liftLabel}>Deads</Text>
              </View>
              <View style={styles.liftRow}>
                <Text style={styles.liftValue}>{day.lifts.squat}</Text>
                <Text style={styles.liftValue}>{day.lifts.bench}</Text>
                <Text style={styles.liftValue}>{day.lifts.deads}</Text>
              </View>
              <Text style={styles.commentsTitle}>Comments:</Text>
              {day.comments.length > 0 ? (
                day.comments.map((c, i) => (
                  <Text key={i} style={styles.commentItem}>• {c}</Text>
                ))
              ) : (
                <View style={styles.commentPlaceholder} />
              )}

              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  placeholderTextColor="#aaa"
                  value={commentInputs[day.name] || ''}
                  onChangeText={(text) =>
                    handleCommentChange(day.name, text)
                  }
                />
                <Button title="Add" onPress={() => addComment(day.name)} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

//just styling for the home page attributes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
  },
  header: {
    fontSize: 24,
    color: '#e63946',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  cardLeft: {
    marginRight: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  playButton: {
    position: 'absolute',
    top: 24,
    left: 24,
  },
  playIcon: {
    fontSize: 24,
    color: '#e63946',
  },
  cardRight: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  liftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  liftLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  liftValue: {
    color: '#fff',
    fontWeight: '700',
  },
  commentsTitle: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },
  commentPlaceholder: {
    height: 40,
    backgroundColor: '#555',
    borderRadius: 4,
    marginTop: 4,
  },
  commentItem: {
    color: '#fff',
    backgroundColor: '#444',
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#444',
    color: '#fff',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    marginRight: 8,
  },
});
