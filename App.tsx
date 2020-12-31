import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  cancelAnimation,
  interpolate,
  Extrapolate,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {
  Button,
  Content,
  initialWaveCenter,
  initialSideWidth,
  Weave,
} from './src/LiquidSwipe';

const slides = [
  {
    backgroundColor: '#4d1168',
    source: require('./assets/secondPageImage.png'),
    title1: 'Online',
    title2: 'Gambling',
    color: '#fd5587',
    description:
      '1- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum pharetra pellentesque. Donec blandit purus ut arcu vulputate, at rutrum sem dictum. Mauris sagittis felis interdum arcu ultrices vestibulum.',
  },
  {
    backgroundColor: 'white',
    source: require('./assets/firstPageImage.png'),
    title1: 'For',
    title2: 'Gamers',
    color: 'black',
    description:
      '2- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum pharetra pellentesque. Donec blandit purus ut arcu vulputate, at rutrum sem dictum. Mauris sagittis felis interdum arcu ultrices vestibulum.',
  },
  {
    backgroundColor: '#4d1168',
    source: require('./assets/secondPageImage.png'),
    title1: 'Online',
    title2: 'Gambling',
    color: '#fd5587',
    description:
      '1- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum pharetra pellentesque. Donec blandit purus ut arcu vulputate, at rutrum sem dictum. Mauris sagittis felis interdum arcu ultrices vestibulum.',
  },
];

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default () => {
  const [element, setElement] = useState(0);
  const [nextElement, setNextElement] = useState(1);

  const isBack = useSharedValue(0);
  const centerY = useSharedValue(initialWaveCenter);
  const progress = useSharedValue(0);

  const maxDist = width - initialSideWidth;

  const handler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      // stop animating progress, this will also place "isBack" value in the
      // final state (we update isBack in progress animation callback)
      cancelAnimation(progress);
      ctx.dragX = 0;
      ctx.startY = isBack.value ? event.y : centerY.value;
    },
    onActive: (event, ctx) => {
      centerY.value = ctx.startY + event.translationY;
      if (isBack.value) {
        progress.value = interpolate(
          event.translationX,
          [0, maxDist],
          [1, 0],
          Extrapolate.CLAMP,
        );
      } else {
        progress.value = interpolate(
          event.translationX,
          [-maxDist, 0],
          [0.4, 0],
          Extrapolate.CLAMP,
        );
      }
    },
    onEnd: () => {
      let goBack;
      if (isBack.value) {
        goBack = progress.value > 0.5 ? 1 : 0;
      } else {
        // TODO: want to use a boolean here
        goBack = progress.value > 0.2 ? 1 : 0;
      }
      centerY.value = withSpring(initialWaveCenter);
      progress.value = withSpring(goBack ? 1 : 0, {}, () => {
        isBack.value = goBack;
      });
    },
  });

  return (
    <View style={styles.container}>
      <Content
        backgroundColor={slides[nextElement].backgroundColor}
        source={slides[nextElement].source}
        title1={slides[nextElement].title1}
        title2={slides[nextElement].title2}
        color={slides[nextElement].color}
        description={slides[nextElement].description}
      />
      <PanGestureHandler
        onGestureEvent={handler}
        onHandlerStateChange={handler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Weave progress={progress} centerY={centerY} isBack={isBack}>
            <Content
              backgroundColor={slides[element].backgroundColor}
              source={slides[element].source}
              title1={slides[element].title1}
              title2={slides[element].title2}
              color={slides[element].color}
              description={slides[element].description}
            />
          </Weave>
          <Button y={centerY} progress={progress} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
