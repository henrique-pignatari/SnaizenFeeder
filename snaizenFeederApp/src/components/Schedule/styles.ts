import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
    },

    scheduledTime: {
        flex: 1,
    },

    hourWeight: {

    },

    hour: {
        fontFamily: theme.fonts.title700,
        color: theme.colors.heading,
        fontSize: 40,
        
    },

    weight: {
        color: theme.colors.heading
    },

    deleteButton: {
        paddingTop: 20,
        paddingRight: 30,
        alignContent: "center",
        justifyContent: "center",

    },

    
})