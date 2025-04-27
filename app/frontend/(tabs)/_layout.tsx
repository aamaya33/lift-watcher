import { Stack, Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CustomTabBar } from '@/app/frontend/components/bottomNav';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#cc0909',
        headerStyle: {
            backgroundColor: '#25292e',
        },
        headerShown: false,
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
            backgroundColor: '#25292e',
            height: 70, // Increased height
        },
        tabBarIconStyle: {
            width: 30, 
            height: 30,
        }
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={40} />
          ),
        }}
      />
      <Tabs.Screen
        name="lifts"
        options={{
          title: 'Lifts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} color={color} size={40}/>
          ),
        }}
      />
      
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={40}/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'id-card' : 'id-card-outline'} color={color} size={40}/>
          ),
        }}
       />
    </Tabs>
  );
}