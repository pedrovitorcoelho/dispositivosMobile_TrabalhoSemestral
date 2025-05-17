import { SafeAreaView, StatusBar } from 'react-native';
import SplashScreen from './SplashScreen';

const Fatec360SplashScreen = ({ onFinish, duration = 2000 }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SplashScreen onFinish={onFinish} duration={duration} />
    </SafeAreaView>
  );
};

export default Fatec360SplashScreen;
