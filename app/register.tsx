// app/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { useRouter, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';

// Allow the native webview to complete the auth session
WebBrowser.maybeCompleteAuthSession();

const handleregister = async (email: string, password: string, username: string, router) => {
  
  if(!email || !password || !username) {
    console.log('Please fill in all fields');
    Alert.alert("Please fill in all fields")
    return;
  }
  
  try {
    const response = await fetch('http://10.239.92.197:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username
      })
  });

  const json = await response.json();
  if (response.ok) {
    console.log('User registered successfully:', json);
    router.replace('/frontend/(tabs)/Home');
  }
  else if (response.status === 400) {
    Alert.alert(
      "Registration Failed", 
      "Email already exists, try logging in with it"
    );
  }

} catch(error) {
    console.error('re:', error);
  }
}

export default function LoginScreen() {

  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Bevan-Regular': require('../assets/fonts/Bevan-Regular.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');


  // Load the fonts
  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }


  // Handle the response from the auth session, if successful, navigate to the home screen
  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     router.replace('/frontend/(tabs)/Home');
  //   }
  // }, [response]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Image
          source={require('../assets/fonts/images/Terrier-Showdown.png')}
          style={styles.logo}
        />

      <TextInput
        style={styles.EmailInput}
        value={email}
        onChangeText={setEmail}
        placeholder="Email:"
        placeholderTextColor="#888888"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.UsernameInput}
        value={username}
        onChangeText={setUsername}
        placeholder="Username:"
        placeholderTextColor="#888888"
        autoCapitalize="none"
      />
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.passwordField}
        value={password}
        onChangeText={setPassword}
        placeholder="Password:"
        placeholderTextColor="#888888"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather 
            name={showPassword ? "eye" : "eye-off"} 
            size={24} 
            color="#888888" 
          />
      </TouchableOpacity>
      </View>
    
      <View style={styles.confirmPasswordContainer}>
      <TextInput
        style={styles.confirmPasswordField}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password:"
        placeholderTextColor="#888888"
        secureTextEntry={!showConfirmPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity 
          style={styles.eyeIcon} 
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Feather 
            name={showConfirmPassword ? "eye" : "eye-off"} 
            size={24} 
            color="#888888" 
          />
      </TouchableOpacity>
      </View>
    
      <TouchableOpacity 
        style={styles.RegisterButton}
        onPress={() => handleregister(email, password, username, router)}
      >
        {/* need to change this */}
        <Text style={{fontFamily: 'Bevan-Regular', color: '#fff', fontSize: '18'}}>REGISTER</Text> 
      </TouchableOpacity>

      <View style={styles.SignUp}>
        <Text style={{fontFamily: 'Bevan-Regular', color: '#000', fontSize: '14'}}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={{fontFamily: 'Bevan-Regular', color: '#FFBF00', fontSize: '14'}}> Sign In!</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C21F31',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    position : 'relative',
    width: 220,
    height: 200,
    bottom: 125,
    resizeMode: 'contain',
  },
  EmailInput: {
    position: 'relative',
    bottom: 105,
    width: 275,
    height: 50,
    fontFamily: 'Bevan-Regular',
    backgroundColor: '#fff',  // box background
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
  },
  UsernameInput: {
    position: 'relative',
    bottom: 85,
    width: 275,
    height: 50,
    fontFamily: 'Bevan-Regular',
    backgroundColor: '#fff',  // box background
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
  },
  passwordContainer: {
    position: 'relative',
    bottom: 65,
    width: 275,
    flexDirection: 'column',
    alignItems: 'center',
  },
  passwordField: {
    width: '100%',
    height: 50,
    fontFamily: 'Bevan-Regular',
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 16,
    padding: 7,
    paddingRight: 40, // Make room for the icon
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmPasswordContainer: {
    position: 'relative',
    bottom: 70,
    width: 275,
    flexDirection: 'column',
    alignItems: 'center',
  },
  confirmPasswordField: {
    width: '100%',
    height: 50,
    fontFamily: 'Bevan-Regular',
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 16,
    padding: 7,
    paddingRight: 40, // Make room for the icon
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  eyeIcon: {
    position: 'relative',
    right: -115,
    bottom: 35
  },
  RegisterButton: {
    position: 'relative',
    bottom: 20,
    width: 275,
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  SignUp: {
    position: 'relative', 
    bottom: -55,
    flexDirection: 'row'
  },
  buttonText: { fontSize: 16, color: '#000', fontWeight: '600' },
});
