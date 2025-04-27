import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Split tabs into left and right sections
  const leftTabs = state.routes.slice(0, 2); // First 2 tabs
  const rightTabs = state.routes.slice(2);   // Remaining tabs
  
  return (
    <View style={styles.tabContainer}>
      {/* Left section tabs */}
      <View style={styles.tabSection}>
        {leftTabs.map((route, index) => renderTabItem(
          route, index, state.index, descriptors, navigation
        ))}
      </View>
      
      {/* Middle add button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.navigate('addWorkout');
        }}
      >
        <Ionicons name="add" color="#fff" size={72} />
      </TouchableOpacity>
      
      {/* Right section tabs */}
      <View style={styles.tabSection}>
        {rightTabs.map((route, index) => renderTabItem(
          route, index + leftTabs.length, state.index, descriptors, navigation
        ))}
      </View>
    </View>
  );
}

// Helper function to render individual tab items
function renderTabItem(route, index, activeIndex, descriptors, navigation) {
  const { options } = descriptors[route.key];
  const isFocused = activeIndex === index;
  const labelColor = isFocused ? '#c21f31' : '#fff';
  return (
    <TouchableOpacity
      key={route.key}
      style={styles.tabButton}
      onPress={() => navigation.navigate(route.name)}
    >
      {options.tabBarIcon && 
        options.tabBarIcon({ 
          color: isFocused ? '#c21f31' : '#fff', 
          focused: isFocused, 
          size: 48
        })}
      
      <View style={styles.labelContainer}>
        <Text style={[styles.tabLabel, { color: labelColor }]}>
          {options.title}
        </Text>
      </View>
      <View style={styles.bottomNavLine }/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomNavLine: {
    width: '1000%',
    height: 1,
    backgroundColor: '#fff',
    position: 'relative',
    bottom: 90,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 110,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  tabSection: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#c21f31',
    width: 74,
    height: 74,
    borderRadius: 37, // Change from 30 to 37 (half of width/height)
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  labelContainer: {
    marginTop: 2, // Small space between icon and text
  },
  tabLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});