import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router"; 

//profile page, this is where users will be able to upload all their personal infromation.
export default function ProfileScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
          <Text style={styles.text}>Profile Screen</Text>
          
          <TouchableOpacity 
            style={styles.LoginButton}
            onPress={() => router.replace('/')}
          >
            <Text style={{fontFamily: 'Bevan-Regular', color: '#fff', fontSize: '18'}}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1E1E",
    },
    text: {
        color: "#fff",
    },
    LoginButton: {
        position: 'relative',
        top: 250,
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
});