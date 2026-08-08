import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, StatusBar} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../theme/colors';

const {width} = Dimensions.get('window');

const LETTERS = ['R', 'e', 'n', 't', 'E', 'a', 's', 'e'];

interface SplashScreenProps {
  navigation: any;
}

export default function SplashScreen({navigation}: SplashScreenProps) {
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(-15);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const screenOpacity = useSharedValue(1);

  // One shared value per letter
  const letterAnimations = LETTERS.map(() => ({
    opacity: useSharedValue(0),
    translateY: useSharedValue(30),
  }));

  const navigateToAuth = () => {
    navigation.replace('Auth');
  };

  useEffect(() => {
    // 1. Logo appears — scale + fade + slight rotation
    logoOpacity.value = withDelay(
      200,
      withTiming(1, {duration: 600, easing: Easing.out(Easing.cubic)}),
    );
    logoScale.value = withDelay(
      200,
      withSpring(1, {damping: 12, stiffness: 100}),
    );
    logoRotate.value = withDelay(
      200,
      withSpring(0, {damping: 10, stiffness: 80}),
    );

    // 2. Glow pulse behind logo
    glowOpacity.value = withDelay(
      600,
      withSequence(
        withTiming(0.6, {duration: 500}),
        withTiming(0.25, {duration: 800}),
      ),
    );

    // 3. Stagger each letter
    letterAnimations.forEach((anim, i) => {
      const delay = 700 + i * 80;
      anim.opacity.value = withDelay(
        delay,
        withTiming(1, {duration: 350, easing: Easing.out(Easing.cubic)}),
      );
      anim.translateY.value = withDelay(
        delay,
        withSpring(0, {damping: 14, stiffness: 120}),
      );
    });

    // 4. Tagline fades in
    taglineOpacity.value = withDelay(
      1500,
      withTiming(1, {duration: 500, easing: Easing.out(Easing.cubic)}),
    );
    taglineTranslateY.value = withDelay(
      1500,
      withSpring(0, {damping: 14, stiffness: 100}),
    );

    // 5. Transition out
    screenOpacity.value = withDelay(
      2800,
      withTiming(0, {duration: 400, easing: Easing.in(Easing.cubic)}),
    );

    const timeout = setTimeout(() => {
      navigateToAuth();
    }, 3200);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {scale: logoScale.value},
      {rotate: `${logoRotate.value}deg`},
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{translateY: taglineTranslateY.value}],
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd]}
        style={styles.gradient}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}>
        {/* Glow effect behind logo */}
        <Animated.View style={[styles.glow, glowStyle]} />

        {/* Logo — House Icon */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.houseIcon}>
            {/* Roof */}
            <View style={styles.roofContainer}>
              <View style={styles.roofLeft} />
              <View style={styles.roofRight} />
            </View>
            {/* Body */}
            <View style={styles.houseBody}>
              {/* Door */}
              <View style={styles.door}>
                <View style={styles.doorKnob} />
              </View>
              {/* Window */}
              <View style={styles.windowRow}>
                <View style={styles.window}>
                  <View style={styles.windowPane} />
                  <View style={styles.windowPane} />
                </View>
              </View>
            </View>
          </View>
          {/* Key accent */}
          <View style={styles.keyContainer}>
            <View style={styles.keyRing} />
            <View style={styles.keyShaft} />
            <View style={styles.keyTooth1} />
            <View style={styles.keyTooth2} />
          </View>
        </Animated.View>

        {/* App Name — letter by letter */}
        <View style={styles.nameRow}>
          {LETTERS.map((letter, i) => {
            const animStyle = useAnimatedStyle(() => ({
              opacity: letterAnimations[i].opacity.value,
              transform: [
                {translateY: letterAnimations[i].translateY.value},
              ],
            }));
            const isAccent = letter === 'R' || letter === 'E';
            return (
              <Animated.Text
                key={`${letter}-${i}`}
                style={[
                  styles.letterText,
                  isAccent && styles.letterAccent,
                  animStyle,
                ]}>
                {letter}
              </Animated.Text>
            );
          })}
        </View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Your Complete Rental Management Tool
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.accent,
    top: '35%',
    alignSelf: 'center',
    // Blur via shadow on Android
    elevation: 60,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 80,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  houseIcon: {
    alignItems: 'center',
    width: 90,
    height: 90,
  },
  roofContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: -2,
  },
  roofLeft: {
    width: 0,
    height: 0,
    borderLeftWidth: 50,
    borderRightWidth: 0,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.accent,
  },
  roofRight: {
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 50,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.accent,
    marginLeft: -2,
  },
  houseBody: {
    width: 70,
    height: 48,
    backgroundColor: Colors.primaryMid,
    borderWidth: 2.5,
    borderColor: Colors.accent,
    borderTopWidth: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  door: {
    width: 20,
    height: 32,
    backgroundColor: Colors.accentAlt,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  doorKnob: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textPrimary,
  },
  windowRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  window: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderRadius: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  windowPane: {
    width: 7,
    height: 7,
    backgroundColor: Colors.accent,
    opacity: 0.35,
    margin: 0.5,
  },
  keyContainer: {
    position: 'absolute',
    right: -12,
    bottom: 5,
    transform: [{rotate: '35deg'}],
  },
  keyRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: Colors.accentAlt,
    marginBottom: -3,
    alignSelf: 'center',
  },
  keyShaft: {
    width: 3,
    height: 20,
    backgroundColor: Colors.accentAlt,
    alignSelf: 'center',
    borderRadius: 1,
  },
  keyTooth1: {
    position: 'absolute',
    bottom: 2,
    right: -1,
    width: 6,
    height: 3,
    backgroundColor: Colors.accentAlt,
    borderRadius: 1,
  },
  keyTooth2: {
    position: 'absolute',
    bottom: 8,
    right: -1,
    width: 5,
    height: 3,
    backgroundColor: Colors.accentAlt,
    borderRadius: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  letterText: {
    fontSize: 42,
    fontWeight: '300',
    color: Colors.textPrimary,
    letterSpacing: 2,
    fontFamily: 'System',
  },
  letterAccent: {
    fontWeight: '700',
    color: Colors.accent,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    fontWeight: '400',
    marginTop: 4,
  },
});
