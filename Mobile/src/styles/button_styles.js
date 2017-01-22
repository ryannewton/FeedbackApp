'use strict';

import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  buttonStyles: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOpacity: 0.8,
      shadowRadius: 2,
      shadowOffset: {
        height: 1,
        width: 0
      },
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
    android: {
      elevation: 4,
      backgroundColor: '#2196F3',
      borderRadius: 2,
    },
  }),
  textStyles: Platform.select({
    ios: {
      textAlign: 'center',
      color: 'white',      
      padding: 8,
      fontWeight: '500',
    },
    android: {
      textAlign: 'center',
      color: 'white',
      padding: 8,
      fontWeight: '500',
    },
  }),
  buttonDisabled: Platform.select({
    ios: {
      backgroundColor: '#dfdfdf',
    },
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf',
    }
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#a1a1a1',
    },
    android: {
      color: '#a1a1a1',
    }
  }),
});
