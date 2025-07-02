import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const testimonials = [
  {
    name: 'John Doe',
    role: 'Professional Trader',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    text: 'TokenlessX has revolutionized my trading experience. The platform is intuitive and the support is exceptional.',
  },
  {
    name: 'Jane Smith',
    role: 'Crypto Investor',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    text: 'I\'ve tried many platforms, but TokenlessX stands out with its security features and user-friendly interface.',
  },
  {
    name: 'Mike Johnson',
    role: 'Day Trader',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    text: 'The real-time analytics and advanced trading tools have significantly improved my trading performance.',
  },
];

const TestimonialCard = ({ testimonial, index, currentIndex }: any) => {
  const inputRange = [index - 1, index, index + 1];
  
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      currentIndex.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );
    
    const opacity = interpolate(
      currentIndex.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar} />
      </View>
      <Text style={styles.name}>{testimonial.name}</Text>
      <Text style={styles.role}>{testimonial.role}</Text>
      <Text style={styles.text}>{testimonial.text}</Text>
    </Animated.View>
  );
};

export default function TestimonialsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexValue = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1);
      currentIndexValue.value = withSpring(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      currentIndexValue.value = withSpring(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Testimonials</Text>
        <Text style={styles.subtitle}>What our users say</Text>
      </View>

      <View style={styles.carouselContainer}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            index={index}
            currentIndex={currentIndexValue}
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.controlText}>Previous</Text>
        </TouchableOpacity>
        
        <View style={styles.dots}>
          {testimonials.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleNext}
          disabled={currentIndex === testimonials.length - 1}
        >
          <Text style={styles.controlText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  controlButton: {
    padding: 12,
  },
  controlText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDot: {
    backgroundColor: '#4CAF50',
  },
}); 