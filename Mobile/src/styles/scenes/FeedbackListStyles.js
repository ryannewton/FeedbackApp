// Import Libraries
import { StyleSheet } from 'react-native';

// Import Styles
import { container } from '../common/container_styles';

const styles = StyleSheet.create({
  container,
  background: {
    flex: 1,
    width: null,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  categoryText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    margin: 5,
    paddingTop: 6,
    fontWeight: '400',
  },
  categoryTextSelected: {
    fontWeight: '800',
    color: '#00A2FF',
  },
  statusSelector: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 5,
  },
  statusSelectorSelected: {
    backgroundColor: 'white',
  },
});

export default styles;
