import React from 'react';
import { connect } from 'react-redux';

import { updateSocketConnection } from '../store/actions/system';

interface Props {
  updateSocketConnection: (name: string) => void;
}

const Join: React.FC<Props> = ({ updateSocketConnection }) => {
  const clickHandler = (): void => {
    updateSocketConnection('Chrille');
  };

  return (
    <div>
      Join!
      <input type='button' value='clickMEEE' onClick={clickHandler} />
    </div>
  );
};

export default connect(null, { updateSocketConnection })(Join);
