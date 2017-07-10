import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  spacingStyle: {
    height: 30,
  },
  layoutStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleViewStyle: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 4,
    marginTop: 0,
    top: 0,
    bottom: 30,
  },
  titleStyle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  iconLayout: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    paddingRight: 5,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  menuTrigger: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  menuTriggerText: {
    color: 'lightgrey',
    fontWeight: '600',
    fontSize: 20,
  },
  disabled: {
    color: '#ccc',
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  contentText: {
    fontSize: 18,
  },
  dropdown: {
    width: 300,
    borderColor: '#999',
    borderWidth: 1,
    padding: 5,
  },
  dropdownOptions: {
    marginTop: 30,
    borderColor: '#ccc',
    borderWidth: 2,
    width: 300,
    height: 200,
  },
  pickerStyle: {
    justifyContent: 'flex-end',
    paddingRight: 17,
  },
  searchBarStyle: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
});

export default styles;
