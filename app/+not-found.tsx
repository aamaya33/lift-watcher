import { View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";

//this is just in case the user tries to access a page that doesn't exist, error checking
export default function NotFoundcreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops, Page Not Found'}} />
            <View style={styles.container}>
                <Link href="/(tabs)/Home" style={styles.button}>
                    Go to Home Screen
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: '#fff',
    },
  });