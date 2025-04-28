import {Text, View, StyleSheet} from "react-native";

//lifts page, this is where users will be able to upload all their new workouts
export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Lift Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#25292e",
    },
    text: {
        color: "#fff",
    },
});