import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title1: {
    fontSize: 48,
    fontWeight: '300',
  },
  title2: {
    fontSize: 48,
    fontWeight: '600',
  },
  description: {
    opacity: 0.5,
    fontSize: 16,
  },
});

interface ContentProps {
  backgroundColor: string;
  color: string;
  description: string;
  source: number;
  title1: string;
  title2: string;
}

export default (props: ContentProps) => {
  const {backgroundColor, color, description, source, title1, title2} = props;
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <Image {...{source}} />
      <View>
        <Text style={[styles.title1, {color}]}>{title1}</Text>
        <Text style={[styles.title2, {color}]}>{title2}</Text>
        <Text style={[styles.description, {color}]}>{description}</Text>
      </View>
    </View>
  );
};
