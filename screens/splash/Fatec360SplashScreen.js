import { SafeAreaView, StatusBar } from 'react-native';
import SplashScreen from './SplashScreen';
import { StyleSheet } from 'react-native';

const Fatec360SplashScreen = ({ onFinish, duration = 2000 }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SplashScreen onFinish={onFinish} duration={duration} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});


export default Fatec360SplashScreen;
