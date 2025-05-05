// app/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { useRouter, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Allow the native webview to complete the auth session
WebBrowser.maybeCompleteAuthSession();

const handlelogin = async (email: string, password: string, router) => {
  
  if(!email || !password) {
    console.log('Please fill in all fields');
    Alert.alert('Please fill in all fields');
    return;
  }
  
  try {
    const response = await fetch('http://10.239.134.25:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
  });

  const json = await response.json();
  if (response.ok) {
    console.log('User logged in successfully:');
    // store information in AsyncStorage
    await AsyncStorage.setItem('userId', String(json.user.id));
    router.replace('/frontend/(tabs)/Home');
  }
  else if (response.status == 400){
    Alert.alert(
      "Login Failed", 
      "Email or password is incorrect"
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

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Use the redirect URI for the platform
  const redirectUri =
    Platform.OS === 'web'
      ? makeRedirectUri()
      : // cast to `any` so TS stops complaining about `useProxy`
        (makeRedirectUri({
          useProxy: true,
          projectNameForProxy: 'terrierShowdown',
        } as any) as string);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:        '373505230707-iminipiictt02h0bgq26prcg5pph47k4.apps.googleusercontent.com',
    iosClientId:     '373505230707-6td4lbgd6vvmi8pugflkaub1efp1sfg6.apps.googleusercontent.com',
    //androidClientId: '<YOUR_ANDROID_CLIENT_ID>.apps.googleusercontent.com', //haven't set this up yet, so commented it out
    webClientId:     '373505230707-iminipiictt02h0bgq26prcg5pph47k4.apps.googleusercontent.com', //don't mess with these
    redirectUri,
  });

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

      {/* <TouchableOpacity 
        style={styles.LoginButton}
        onPress={() => router.replace('/frontend/(tabs)/Home')}
      > */}
      <TouchableOpacity 
        style={styles.LoginButton}
        // onPress={() => handlelogin(email, password, router)}
        onPress={() => {
          handlelogin(email, password, router);
        }}
      >
        {/* need to change this */}
        <Text style={{fontFamily: 'Bevan-Regular', color: '#fff', fontSize: '18'}}>LOGIN</Text> 
      </TouchableOpacity>

      <View style={styles.SignUp}>
        <Text style={{fontFamily: 'Bevan-Regular', color: '#000', fontSize: '14'}}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.replace('/register')}>
          <Text style={{fontFamily: 'Bevan-Regular', color: '#FFBF00', fontSize: '14'}}> Register!</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Image
          source={require('../assets/fonts/images/google-logo.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

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
    width: 275,
    height: 250,
    bottom: 155,
    resizeMode: 'contain',
  },
  EmailInput: {
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
    flexDirection: 'row',
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
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  LoginButton: {
    position: 'relative',
    bottom: -5,
    width: 275,
    height: 50,
    backgroundColor: '#000',  // box background
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

  googleButton: {
    position: 'relative',
    bottom: -100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4
  },
  
  googleIcon: { width: 24, height: 24, marginRight: 8},
  buttonText: { fontSize: 16, color: '#000', fontWeight: '600' },
});
