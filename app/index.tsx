// app/index.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { useRouter, Stack } from 'expo-router';

// Allow the native webview to complete the auth session
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

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

  // Handle the response from the auth session, if successful, navigate to the home screen
  useEffect(() => {
    if (response?.type === 'success') {
      router.replace('/(tabs)/Home');
    }
  }, [response]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Image
          source={require('../assets/fonts/images/Terrier-Showdown.png')}
          style={styles.logo}
        />

        <View style={styles.emailInput}>
          <Text style={{fontFamily: 'Bevan-Regular'}}>Welcome to Lift Watcher</Text>
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
    width: 220,
    height: 220,
    marginBottom: 32,
    resizeMode: 'contain',
  },
  emailInput: {
    width: '100%',
    marginTop: 16,
    marginBottom: 50,
    font: 'Bevan'
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 100
  },
  
  googleIcon: { width: 24, height: 24, marginRight: 8},
  buttonText: { fontSize: 16, color: '#000', fontWeight: '600' },
});
