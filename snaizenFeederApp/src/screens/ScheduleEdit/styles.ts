import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: 32,
    },
    
    label: {
        fontSize: 18,
        marginBottom: 4,
        fontFamily: theme.fonts.title700,
        color: theme.colors.heading,
    },

    field: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 30,
    },

    column: {
        flexDirection: "row",
        alignItems: "center",
    },

    divider: {
        marginRight: 4,
        fontSize: 15,
        fontFamily: theme.fonts.text500,
        color: theme.colors.highlight,
    },

    confirmButton: {
        marginHorizontal: 80,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: theme.colors.on
    },

    confirmText: {
        fontFamily: theme.fonts.title700,
        fontSize: 25,
        color: 'white'
    }
})