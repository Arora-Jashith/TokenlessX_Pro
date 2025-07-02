import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const plans = [
  {
    name: 'Basic',
    price: 9.99,
    features: ['Basic Trading', 'Email Support', 'Basic Analytics'],
    color: '#4CAF50',
  },
  {
    name: 'Pro',
    price: 19.99,
    features: ['Advanced Trading', 'Priority Support', 'Advanced Analytics', 'API Access'],
    color: '#2196F3',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: ['All Pro Features', 'Dedicated Support', 'Custom Solutions', 'White Label'],
    color: '#FF9800',
  },
];

const PricingCard = ({ plan, index, isYearly }: any) => {
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
        plan.popular && styles.popularCard,
        { borderColor: plan.color },
      ]}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
      <Text style={styles.planName}>{plan.name}</Text>
      <Text style={styles.price}>
        ${isYearly ? plan.price * 12 * 0.9 : plan.price}
        <Text style={styles.period}>/{isYearly ? 'year' : 'month'}</Text>
      </Text>
      <View style={styles.features}>
        {plan.features.map((feature: string, i: number) => (
          <View key={i} style={styles.feature}>
            <Text style={styles.featureText}>✓ {feature}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: plan.color }]}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function PricingScreen() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePosition = useSharedValue(0);

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: togglePosition.value }],
  }));

  const handleToggle = () => {
    setIsYearly(!isYearly);
    togglePosition.value = withSpring(isYearly ? 0 : 100, {
      damping: 20,
      stiffness: 200,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pricing Plans</Text>
        <Text style={styles.subtitle}>Choose the perfect plan for you</Text>
        
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Monthly</Text>
          <TouchableOpacity
            style={styles.toggle}
            onPress={handleToggle}
          >
            <Animated.View style={[styles.toggleButton, toggleStyle]} />
          </TouchableOpacity>
          <Text style={styles.toggleText}>Yearly</Text>
          <Text style={styles.discountText}>Save 10%</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            index={index}
            isYearly={isYearly}
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
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggle: {
    width: 50,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginHorizontal: 10,
    padding: 2,
  },
  toggleButton: {
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  discountText: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 10,
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
    borderWidth: 1,
  },
  popularCard: {
    transform: [{ scale: 1.05 }],
    marginVertical: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  period: {
    fontSize: 16,
    color: '#888888',
  },
  features: {
    marginBottom: 20,
  },
  feature: {
    marginBottom: 8,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 