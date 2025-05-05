import React, { useState, useCallback } from 'react';
import { Stack } from 'expo-router';
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

type Exercise = {
  id: number;
  liftType: string;
  weight: number;
  variation: string;
  sets: number;
  reps: number;
  notes?: string;
  workout: {
    id: number;
    name: string;
    createdAt: string;
  };
};

type DayGroup = {
  dateKey: string;
  dayName: string;
  exercises: Exercise[];
};

//home page where user sees their workouts for the week.
export default function HomeScreen() {
  const [groups, setGroups] = useState<DayGroup[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const raw = await AsyncStorage.getItem('userId');
        if (!raw) return;
        const userId = parseInt(raw, 10);
        const url = `http://10.239.29.109:3000/workouts/getExercises?userIdString=${userId}`;
        const res = await fetch(url);
        const body = await res.json();
        if (!body.success) {
          console.warn(body.message);
          return;
        }

        // body.exercises is Exercise[]
        const byDate: Record<string, Exercise[]> = {};
        for (let ex of body.exercises as Exercise[]) {
          const iso = ex.workout.createdAt
            ? ex.workout.createdAt
            : ex.workout.name.replace('Workout for ', '');
          const dateKey = iso.slice(0, 10);               // "2025-05-04"
          (byDate[dateKey] = byDate[dateKey] || []).push(ex);
        }

        const newGroups: DayGroup[] = Object.entries(byDate).map(
          ([dateKey, exercises]) => ({
            dateKey,
            dayName: format(parseISO(dateKey), 'EEEE'),
            exercises,
          })
        );
        // sort by date ascending
        newGroups.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
        setGroups(newGroups);
      })();
    }, [])
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>
          Week of {groups[0] && format(parseISO(groups[0].dateKey), 'MM/dd/yyyy')}
        </Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {groups.map((day) => (
          <View key={day.dateKey} style={styles.card}>
            {/* Day Header */}
            <Text style={styles.dayHeader}>{day.dayName}</Text>

            {/* Row: Thumbnail + Play */}
            <View style={styles.mediaRow}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80' }} // Placeholder image
                style={styles.thumbnail}
              />
              <TouchableOpacity style={styles.playOverlay}>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Row: Lift Labels */}
            <View style={styles.liftLabelRow}>
              {['Squat', 'Bench', 'Deads'].map((label) => (
              <Text key={label} style={styles.liftLabel}>
                {label}
              </Text>
            ))}
            </View>

            {/* Row: Lift Values */}
            <View style={styles.liftValueRow}>
              {day.exercises.map((ex) => (
                <Text key={ex.id} style={styles.liftValue}>
                  {ex.weight}
                </Text>
              ))}
            </View>

            {/* Comments Block */}
            <Text style={styles.commentsTitle}>Comments:</Text>
            <View style={styles.commentsBox}>
              {day.exercises.every((e) => !e.notes) ? (
                <Text style={styles.noComments}>No comments</Text>
              ) : (
                day.exercises
                .map((e) => e.notes)
                .filter(Boolean)
                .map((n, i) => (
                  <Text key={i} style={styles.commentItem}>
                    • {n}
                  </Text>
                ))
              )}
            </View>
          </View>
        ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  // Scroll container
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  
  // Card container
  card: {
    backgroundColor: '#2E2E2E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Android
    elevation: 4,
  },

  // Day name
  dayHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },

  // Header
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e63946',
    textAlign: 'center',
    marginVertical: 16,
  },

  // Thumbnail + play overlay container
  mediaRow: {
    position: 'relative',
    marginBottom: 16,
    alignSelf: 'center',
  },

  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#444',
  },

  playOverlay: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 8,
  },

  playIcon: {
    color: '#e63946',
    fontSize: 24,
  },

  // Lift label row
  liftLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  liftLabel: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },

  // Lift value row
  liftValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  liftValue: {
    flex: 1,
    textAlign: 'center',
    color: '#FFBF00',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Comments section
  commentsTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  commentsBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  noComments: {
    color: '#666',
    fontStyle: 'italic',
  },
  commentItem: {
    color: '#000',
    marginBottom: 4,
  },
});
