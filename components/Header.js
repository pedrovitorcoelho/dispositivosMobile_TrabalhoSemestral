import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"

export default function Header() {
  const navigation = useNavigation()
  const route = useRoute()

  const handleBackPress = () => {
    // Se estamos na tela MeusQuestionarios e há um questionário recém-salvo
    if (route.name === "MeusQuestionarios" && route.params?.novoQuestionario) {
      // Ir direto para HomeGestor (resetar navegação)
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeGestor" }],
      })
    } else {
      // Comportamento normal de voltar
      navigation.goBack()
    }
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Feather name="arrow-left" size={24} color="#3C4A5D" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
})
