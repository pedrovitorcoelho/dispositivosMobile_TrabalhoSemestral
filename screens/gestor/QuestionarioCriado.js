import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNavigation from '../../components/BottomNavigation';

// Get screen dimensions
const { width } = Dimensions.get('window');

export default function QuestionarioCriado() {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState('home');
  
  // Get category from route params or use default
  const categoria = route.params?.categoria || 'Equipamentos';
  
  // Sample data for questionnaires
  const [questionarios, setQuestionarios] = useState([
    {
      id: 1,
      titulo: 'Equipamentos da biblioteca',
      numPerguntas: 5
    },
    {
      id: 2,
      titulo: 'Equipamentos do laboratório de química',
      numPerguntas: 5
    }
  ]);
  
  // Toast animation value
  const [toastVisible, setToastVisible] = useState(false);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const toastTranslateY = useState(new Animated.Value(-50))[0];
  
  // Check if we should show success toast from navigation params
  useEffect(() => {
    if (route.params?.showSuccessToast) {
      showToast();
    }
  }, [route.params?.showSuccessToast]);
  
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    navigation.navigate(tab);
  };
  
  const navigateToCriarQuestionario = () => {
    navigation.navigate('CriarQuestionario');
  };
  
  const navigateToQuestionario = (questionario) => {
    // Navigate to questionnaire details screen
    console.log('Navigating to questionnaire:', questionario);
    // navigation.navigate('DetalhesQuestionario', { questionarioId: questionario.id });
  };
  
  // Function to show toast message
  const showToast = () => {
    setToastVisible(true);
    
    // Animate toast in
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(toastTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(toastTranslateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        setToastVisible(false);
      });
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Success Toast */}
        {toastVisible && (
          <Animated.View 
            style={[
              styles.toast,
              {
                opacity: toastOpacity,
                transform: [{ translateY: toastTranslateY }]
              }
            ]}
          >
            <Feather name="check" size={20} color="#2E7D32" />
            <Text style={styles.toastText}>Questionário salvo com sucesso!</Text>
          </Animated.View>
        )}
        
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={26} color="#3C4A5D" />
          </TouchableOpacity>
          
          {/* Category Title */}
          <Text style={styles.categoryTitle}>{categoria}</Text>
          
          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Meus questionários criados sobre {categoria.toLowerCase()}
          </Text>
          
          {/* Questionnaires List */}
          <View style={styles.questionariosContainer}>
            {questionarios.map((questionario) => (
              <TouchableOpacity
                key={questionario.id}
                style={styles.questionarioCard}
                onPress={() => navigateToQuestionario(questionario)}
              >
                <Text style={styles.questionarioTitle}>{questionario.titulo}</Text>
                <Text style={styles.questionarioInfo}>
                  {questionario.numPerguntas} pergunta{questionario.numPerguntas !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Create New Questionnaire Button */}
          <TouchableOpacity 
            style={styles.criarButton}
            onPress={navigateToCriarQuestionario}
          >
            <Text style={styles.criarButtonText}>Criar novo questionário</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    marginBottom: 56, // Height of bottom navigation
  },
  scrollContainer: {
    padding: 22,
    paddingBottom: 80, // Extra padding at the bottom
  },
  backButton: {
    padding: 6,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#3C4A5D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  questionariosContainer: {
    marginBottom: 24,
  },
  questionarioCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  questionarioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3C4A5D',
    marginBottom: 8,
  },
  questionarioInfo: {
    fontSize: 15,
    color: '#666',
  },
  criarButton: {
    backgroundColor: '#4A6572',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  criarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  toast: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E8F5E9',
    padding: 16,
    marginHorizontal: 22,
    marginTop: 22,
    borderRadius: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  toastText: {
    color: '#2E7D32',
    fontSize: 16,
    marginLeft: 8,
  }
});