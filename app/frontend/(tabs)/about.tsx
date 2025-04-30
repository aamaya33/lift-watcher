import {Text, View, StyleSheet} from "react-native";

//about page, we can change this to something else if need be
export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>About Screen</Text>
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
});