import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native';
const LoadingScreen = () => {
  return (
    <SafeAreaView className='flex-1 bg-primary flex justify-center items-center'>
      <LottieView
        autoPlay
        style={{
          width: 500,
          height: 500,
        }}
        source={require('../assets/lottie/loading.json')}
      />
    </SafeAreaView>
  )
}

export default LoadingScreen