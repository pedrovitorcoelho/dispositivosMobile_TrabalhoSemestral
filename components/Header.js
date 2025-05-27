"use client"
import { TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

export default function Header({ navigation, iconName = "arrow-left", iconSize = 26, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <TouchableOpacity style={styles.backButton} onPress={handlePress}>
      <Feather name={iconName} size={iconSize} color="#3C4A5D" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    padding: 6,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
})
