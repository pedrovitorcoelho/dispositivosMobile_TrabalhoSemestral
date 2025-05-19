import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function BottomNavigation({ activeTab, onTabPress }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => onTabPress("home")}>
        <Ionicons name="home-outline" size={24} color={activeTab === "home" ? "#5c6670" : "#9ca3af"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => onTabPress("documents")}>
        <Ionicons name="document-text-outline" size={24} color={activeTab === "documents" ? "#5c6670" : "#9ca3af"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => onTabPress("stats")}>
        <Ionicons name="stats-chart-outline" size={24} color={activeTab === "stats" ? "#5c6670" : "#9ca3af"} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f3f4f6",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
})
