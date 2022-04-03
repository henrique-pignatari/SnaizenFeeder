import { StyleSheet } from "react-native";
import { theme } from "../../global/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },

    status:{
        fontFamily: theme.fonts.title500,
        fontSize: 24,
        marginRight: 6,
    },

    message: {
        fontFamily: theme.fonts.text400,
        color: theme.colors.highlight,
    },

})