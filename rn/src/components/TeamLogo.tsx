import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { teamLogoStyles as styles } from '../styles/scoreboardStyles';

interface Props {
  url: string;
}

/** Equivale al <div class="logo"> + setLogo() del web */
export function TeamLogo({ url }: Props) {
  const [errored, setErrored] = useState(false);

  const showPlaceholder = !url || errored;

  return (
    <View style={styles.container}>
      {showPlaceholder ? (
        <Text style={styles.placeholder}>LOGO</Text>
      ) : (
        <Image
          source={{ uri: url }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setErrored(true)}
        />
      )}
    </View>
  );
}
