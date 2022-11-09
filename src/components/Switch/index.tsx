import React, {
  ButtonHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
} from 'react';
import { useField } from '@unform/core';
import Switch from '@material-ui/core/Switch';

import { Container } from './styles';

interface SwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  handleSwitchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  initialValue?: boolean;
  disabled?: boolean;
}

const SwitchButton: React.FC<SwitchProps> = ({
  name,
  handleSwitchChange,
  initialValue,
  disabled,
}) => {
  const switchRef = useRef(null);
  const [isChecked, setIsChecked] = useState<boolean | undefined>(
    initialValue ?? false,
  );
  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    setIsChecked(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    event => {
      setIsChecked(event.target.checked);
      handleSwitchChange(event.target.checked);
    },
    [handleSwitchChange],
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: switchRef.current,
      getValue: () => {
        return isChecked;
      },
    });
  }, [fieldName, registerField, isChecked]);

  return (
    <Container>
      <Switch
        ref={switchRef}
        checked={isChecked}
        onChange={handleChange}
        color="primary"
        disabled={disabled ?? false}
      />
    </Container>
  );
};

export default SwitchButton;
