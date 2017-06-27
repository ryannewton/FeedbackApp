import React from 'react';

const Card = props => (
  <div style={styles.containerStyle}>
    {props.children}
  </div>
);

const styles = {
  containerStyle: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    boxShadow: 2,
    elevation: 1,
    marginBottom: 4,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    paddingBottom: 10,
  },
};

export { Card };
