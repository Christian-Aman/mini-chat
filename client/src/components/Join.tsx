import React from 'react';
import { connect } from 'react-redux';
import { updateConnection } from '../store/actions/chat';

interface Props {}

const Join: React.FC<Props> = () => {
  return <div>Join!</div>;
};

export default connect(null, { updateConnection })(Join);
