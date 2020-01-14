import React, { useCallback, useState } from 'react';

interface Props {
  label: string;
  callback: () => {};
}

const Input: React.FC<Props> = (label, callback) => {
  return <div>Input</div>;
};

export default Input;
