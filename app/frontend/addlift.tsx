import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  Touchable,

} from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter, Stack } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function addLift() {
    const [weight, setWeight] = useState('');
    const [liftType, setLiftType] = useState('');
    const [liftTypeDropdownVisible, setLiftTypeDropdownVisible] = useState(false);
    const [variation, setVariation] = useState('');
    const [variationDropdownVisible, setVariationDropdownVisible] = useState(false);
    const [expectedRPE, setExpectedRPE] = useState('');
    const [expectedRPEVisible, setExpectedRPEVisible] = useState(false);
    const [actualRPE, setActualRPE] = useState('');
    const [actualRPEVisible, setActualRPEVisible] = useState(false);
    const [comments, setComments] = useState('');


    const [onPlayVideo, setOnPlayVideo] = useState(false);
    const [videoThumbnailUri, setVideoThumbnailUri] = useState('https://example.com/video-thumbnail.jpg'); // Replace with actual thumbnail URI

    const router = useRouter();

    return(
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Top section with video and stacked inputs */}
          <View style={styles.topSection}>
            {/* Video preview - left side */}
            <View style={styles.videoContainer}>
              <TouchableOpacity activeOpacity={0.8}>
                <Image
                  source={{ uri: videoThumbnailUri }}
                  style={styles.videoThumbnail}
                />
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
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
                    <ScrollView
                    style={styles.dropdownScroll}
                    showsVerticalScrollIndicator={true}
                  >
                    {['Squat', 'Bench Press', 'Deadlift', 'Accessory'].map((item) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        key={item}
                        onPress={() => {
                          setLiftType(item);
                          setLiftTypeDropdownVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
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
          
          {/* RPE row */}
            {/* Expected RPE */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Expected RPE</Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => {
                  setExpectedRPEVisible(prev=> !prev)
                  setActualRPEVisible(false)
                }}
              >
                <Text style={styles.dropdownText}>
                  {expectedRPE || 'Select Expected RPE'}
                </Text>
                <Ionicons
                  name={expectedRPEVisible ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>

              {expectedRPEVisible && (
                <View style={styles.dropdownModal}>
                  <ScrollView
                    style={styles.dropdownScroll}
                    showsVerticalScrollIndicator
                  >
                    {[...Array(10)].map((_, i) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        key={i}
                        onPress={() => {
                          setExpectedRPE(i + 1);
                          setExpectedRPEVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{i + 1}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Actual RPE */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Actual RPE</Text>
              <TouchableOpacity
                style={styles.dropdownSelector}
                onPress={() => {
                  setActualRPEVisible(prev=> !prev)
                  setExpectedRPEVisible(false)
                }}
              >
                <Text style={styles.dropdownText}>
                  {actualRPE || 'Select Actual RPE'}
                </Text>
                <Ionicons
                  name={actualRPEVisible ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>

              {actualRPEVisible && (
                <View style={styles.dropdownModal}>
                  <ScrollView
                    style={styles.dropdownScroll}
                    showsVerticalScrollIndicator
                  >
                    {[...Array(10)].map((_, i) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        key={i}
                        onPress={() => {
                          setActualRPE(i + 1);
                          setActualRPEVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{i + 1}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
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
              // Handle adding the lift
              console.log('Lift added:', {
                weight,
                liftType,
                variation,
                expectedRPE,
                actualRPE,
                comments,
              });
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
    top: 200/2 - 20,
    left: '50%',
    marginLeft: -20,
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
    bottom: -5,
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
}
});