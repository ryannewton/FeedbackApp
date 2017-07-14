import React from 'react';
import ReactTimeAgo from 'react-timeago';

const TimeAgo = (props) => {
  const timestamp = new Date(props.timestamp);
  return (
    <div style={{ fontSize: 10 }}>
      <ReactTimeAgo date={timestamp} />
    </div>
  )
}

export default TimeAgo;
