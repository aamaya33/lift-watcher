import {Text, View, StyleSheet} from "react-native";

//profile page, this is where users will be able to upload all their personal infromation.
export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Profile Screen</Text>
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