import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const features = [
  {
    title: 'Secure Trading',
    description: 'Advanced security measures to protect your assets',
    color: '#4CAF50',
  },
  {
    title: 'Real-time Analytics',
    description: 'Get instant insights into market trends',
    color: '#2196F3',
  },
  {
    title: 'User-friendly Interface',
    description: 'Intuitive design for seamless trading experience',
    color: '#FF9800',
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your needs',
    color: '#E91E63',
  },
];

const FeatureCard = ({ title, description, color, index }: any) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withDelay(
      index * 200,
      withSpring(0, {
        damping: 12,
        stiffness: 100,
      })
    );
    opacity.value = withDelay(
      index * 200,
      withTiming(1, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        animatedStyle,
        { borderLeftColor: color, borderLeftWidth: 4 },
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Animated.View>
  );
};

export default function FeaturesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Features</Text>
        <Text style={styles.subtitle}>Discover what makes us unique</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            {...feature}
            index={index}
          />
        ))}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#888888',
    lineHeight: 24,
  },
}); 