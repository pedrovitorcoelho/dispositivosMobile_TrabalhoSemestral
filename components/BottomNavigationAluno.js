import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function BottomNavigation({ activeTab, onTabPress, navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => onTabPress("home")}>
        <Ionicons name="home-outline" size={24} color={activeTab === "home" ? "#5c6670" : "#9ca3af"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation?.navigate("EnviarFeedBackAluno")}>
        <Ionicons name="add-outline" size={24} color={activeTab === "stats" ? "#5c6670" : "#9ca3af"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => onTabPress("documents")}>
        <Ionicons name="document-text-outline" size={24} color={activeTab === "documents" ? "#5c6670" : "#9ca3af"} />
      </TouchableOpacity>
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  navItem: {
    padding: 10,
  },
})
