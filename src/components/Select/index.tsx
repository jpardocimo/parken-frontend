import React, { useState, useCallback } from 'react';
import ReactSelect, {
  OptionTypeBase,
  Props as SelectProps,
} from 'react-select';

import { Container } from './styles';

interface Props extends SelectProps<OptionTypeBase> {
  name: string;
  defaultValue: any;
  options: any;
}

const SelectSimple: React.FC<Props> = ({ defaultValue, options }: Props) => {
  const [selectedOption, setSelectedOption] = useState<any>();

  const handleChange = useCallback((option: any) => {
    setSelectedOption(option);
  }, []);

  return (
    <Container>
      <ReactSelect
        name="type"
        value={selectedOption}
        options={options}
        onChange={e => handleChange(e)}
        defaultValue={defaultValue}
      />
    </Container>
  );
};

export default SelectSimple;
