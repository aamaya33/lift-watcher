import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';


export default function addLift() {
    const [weight, setWeight] = useState('');
    const [liftType, setLiftType] = useState('');
    const [liftTypeDropdownVisible, setLiftTypeDropdownVisible] = useState(false);
    const [variation, setVariation] = useState('');
    const [variationDropdownVisible, setVariationDropdownVisible] = useState(false);
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [comments, setComments] = useState('');
    const [userId, setUserId] = useState('');
    const [workoutId, setWorkoutId] = useState('');


    // Video state
    const [videoUri, setVideoUri] = useState('');
    const [videoThumbnailUri, setVideoThumbnailUri] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<Video>(null);

    const router = useRouter();
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      }catch (error) {
        console.error('Error retrieving userId:', error);
      }
    };
    getUserId();

    const pickVideo = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera is required!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]){
        setVideoUri(result.assets[0].uri);
        setVideoThumbnailUri(result.assets[0].uri); 
      };
    };

    const handleExerciseSubmit = async () => {
      try {
        const payload = {
          userId: parseInt(userId),
          workoutId: workoutId ? parseInt(workoutId) : null,
          weight: parseFloat(weight),
          liftType,
          variation,
          sets: parseInt(sets),
          reps: parseInt(reps),
          notes: comments || null,
          videoUri: videoUri || null, //this is just storing the local uri must be changed if we want to expand 
        };
        console.log('Submitting payload:', JSON.stringify(payload));

        const response = await fetch('http://10.239.134.25:3000/workouts/addExercise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server responded with error:', response.status, errorText);
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          console.log('Exercise added successfully:', data.exercise);
          router.replace('/frontend/(tabs)/Home'); // Navigate to home screen
          // Optionally navigate to another screen or show a success message
        }
      }catch (error) {
        console.error(error);
      }
    };

    return(
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top section with video and stacked inputs */}
          <View style={styles.topSection}>
            {/* Video preview - left side */}
            <View style={styles.videoContainer}>
            {videoUri ? (
              <TouchableOpacity 
                activeOpacity={0.8} 
                onPress={() => {
                  if (videoRef.current) {
                    setIsPlaying(!isPlaying);
                    isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync();
                  }
                }}
              >
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.videoThumbnail}
              resizeMode={ResizeMode.COVER}
              useNativeControls={isPlaying}
            />
            {!isPlaying && (
              <View style={styles.playButton}>
                <Ionicons name="play" size={24} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.videoThumbnail, styles.uploadContainer]} 
            activeOpacity={0.8}
            onPress={pickVideo}
          >
            <Ionicons name="cloud-upload-outline" size={40} color="#fff" />
            <Text style={{color: '#fff', fontSize: 16, fontFamily: 'Bevan', marginTop: 8}}>
              Upload Video
            </Text>
          </TouchableOpacity>
        )}

              {/* <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{ uri: videoThumbnailUri }}
                  style={styles.videoThumbnail}
                />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </TouchableOpacity> */}
            </View>

            {/* Right side stacked inputs */}
            <View style={styles.rightStackContainer}>

              {/* Lift Type */}
              <View style={styles.liftCard}>
                <Text style={styles.cardLabel}>Lift Type</Text>
                <TouchableOpacity
                  style={styles.dropdownSelector}
                  onPress={() => setLiftTypeDropdownVisible(!liftTypeDropdownVisible)}
                >
                  <Text style={styles.dropdownText}>
                    {liftType || 'Select Lift Type'}
                  </Text>
                  <Ionicons
                    name={liftTypeDropdownVisible ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              {liftTypeDropdownVisible && (
                // <View style={styles.dropdownOverlay}>
                  <View style={styles.dropdownModal}>
                    {['Squat', 'Bench Press', 'Deadlift', 'Accessory'].map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setLiftType(item);
                          setLiftTypeDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View> 
              )}
              {/* Weight */}
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Weight</Text>
                <TextInput
                  style={styles.weightInput}
                  keyboardType="numeric"
                  value={String(weight)}
                  onChangeText={setWeight}
                  placeholder="225"
                  placeholderTextColor="#888"
                />
              </View>

              {/* Variation */}
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Variation</Text>
                <TouchableOpacity
                  style={styles.dropdownSelector}
                  onPress={() => setVariationDropdownVisible(!variationDropdownVisible)}
                  
                >
                  <Text style={styles.dropdownText}>
                    {variation || 'Select Variation'}
                  </Text>
                  <Ionicons
                    name={variationDropdownVisible ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              {variationDropdownVisible && (
                  <View style={styles.dropdownModal}>
                    {['Conventional', 'Sumo', 'Pause'].map((item) => (
                      <TouchableOpacity
                        key={item}
                        onPress={() => {
                          setVariation(item);
                          setVariationDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
              )}
            </View>
          </View>
          
          {/* sets/reps row */}
            {/* sets */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Sets</Text>
              <TextInput 
                style={styles.weightInput}
                keyboardType="numeric"
                value={String(sets)}
                onChangeText={setSets}
                placeholder='3'
                placeholderTextColor="#888"
              />
            </View>


            {/* reps */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Reps</Text>
              <TextInput 
                style={styles.weightInput}
                keyboardType="numeric"
                value={String(reps)}
                onChangeText={setReps}
                placeholder='12'
                placeholderTextColor="#888"
              />
            </View>
          {/* </View> */}

          {/* Comments */}
          <Text style={[styles.cardLabel, { marginTop: 24, marginLeft: 8 }]}>
            Comments:
          </Text>
          <TextInput
            style={styles.commentBox}
            multiline
            textAlignVertical="top"
            placeholder="Add any notes here…"
            placeholderTextColor="#888"
            value={comments}
            onChangeText={setComments}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              console.log('Lift added:', {
                userId,
                weight,
                liftType,
                variation,
                sets,
                reps,
                comments,
              });
              handleExerciseSubmit();
            }}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Bevan' }}>
              Add Lift
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',  // dark background
    padding: 16,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  videoContainer: {
    flex: 1,
    marginRight: 8,
  },
  rightStackContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  videoThumbnail: {
    width: '100%',
    height: 255,
    borderRadius: 12,
    backgroundColor: '#2E2E2E',
    padding: 8,
    paddingTop: 12,
    marginVertical: 15,
    marginRight: 8,
    marginLeft: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  playButton: {
    position: 'absolute',
    top: 125,
    left: '50%',
    marginLeft: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C21F31',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  liftCard: {
    backgroundColor: '#2E2E2E',
    borderRadius: 8,
    padding: 8,
    marginTop: 15,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  card: {
    backgroundColor: '#2E2E2E',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardLabel: {
    fontFamily: 'Bevan',
    color: '#FFF',
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.9,
  },
  picker: {
    color: '#FFF',
    fontFamily: 'Bevan',
    fontSize: 16,
    backgroundColor: 'transparent',
    height: 100, // Reduced height
  },
  weightInput: {
    color: '#FFF',
    fontFamily: 'Bevan',
    fontSize: 24,
    textAlign: 'center',
    height: 32,
  },
  commentBox: {
    marginTop: 8,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    marginRight: 8,
    marginLeft: 8,
    height: 120,
    padding: 12,
    fontFamily: 'Bevan',
    fontSize: 16,
    color: '#000',
    marginBottom: 20, // Add bottom margin for scrolling space
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

dropdownSelector: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 40,
  paddingHorizontal: 10,
},

dropdownText: {
  color: '#FFF',
  fontFamily: 'Bevan',
  fontSize: 16,
},

dropdownModal: {
  backgroundColor: '#2E2E2E',
  borderRadius: 8,
  width: '80%',
  maxHeight: '70%',
  padding: 10,
  marginBottom: 10,
  overflow: 'hidden',
},

dropdownItem: {
  paddingVertical: 12,
  paddingHorizontal: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#444',
},

dropdownItemText: {
  color: '#FFF',
  fontFamily: 'Bevan',
  fontSize: 16,
},
dropdownScroll: {
  width: '100%',
},
addButton: {
  position: 'relative',
    bottom: -25,
    width: 400,
    height: 50,
    backgroundColor: '#FFBF00',  // box background
    borderColor: '#333',      // optional border
    borderWidth: 1,           // optional border width
    borderRadius: 16,         // <-- magic for rounded corners
    padding: 7,             // so the text isn’t squished
    // optional: shadow on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    // optional: elevation for Android shadow
    elevation: 3,
    alignSelf: 'center',
    alignItems: 'center',
},
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E2E2E',
    borderWidth: 2,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
});