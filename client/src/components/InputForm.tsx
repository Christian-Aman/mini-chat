import React, { useState } from 'react';
import { Input, InputGroup, Button } from 'sancho';

interface Props {
  inputLabel: string;
  inputPlaceholder: string;
  buttonText: string;
  callbackFunction: (inputText: string) => any;
}

const InputForm: React.FC<Props> = ({
  inputLabel,
  inputPlaceholder,
  buttonText,
  callbackFunction,
}) => {
  const [inputText, setInputText] = useState('');

  const submit = (event: any): void => {
    event.preventDefault();
    callbackFunction(inputText);
    setInputText('');
  };

  return (
    <div style={{ margin: '1em 0' }}>
      <form
        onSubmit={event => submit(event)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <InputGroup label={inputLabel} hideLabel>
          <Input
            placeholder={inputPlaceholder}
            value={inputText}
            onChange={event => setInputText(event.target.value)}
          />
        </InputGroup>
        <Button
          variant='outline'
          onClick={submit}
          style={{ marginLeft: '1em' }}>
          {buttonText}
        </Button>
      </form>
    </div>
  );
};

export default InputForm;
