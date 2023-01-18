import {
  ChangeEvent,
  FormEvent,
  Fragment,
  HTMLInputTypeAttribute,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import styled from 'styled-components';
import Button from './styled/Button';
import Input from './styled/Input';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledTitle = styled.div`
  font-size: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

type Field = {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
};

const Form = <
  T extends { [k: string]: Field },
  U extends { [K in keyof T]: string },
>({
  fields,
  onSubmit: onSubmitCallback,
  submitButtonText,
}: {
  fields: T;
  onSubmit: (fields: U) => void;
  submitButtonText: string;
}): ReactElement => {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(
      Object.entries(fields).map(([k, { value }]) => [k, value]),
    ) as U,
  );

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmitCallback(formValues);
      setFormValues(
        Object.fromEntries(
          Object.entries(formValues).map(([k]) => [k, '']),
        ) as U,
      );
    },
    [onSubmitCallback, formValues],
  );

  return (
    <StyledForm onSubmit={onSubmit}>
      <List>
        {Object.entries(fields).map(([name, { type, placeholder }]) => (
          <Fragment key={name}>
            <StyledTitle>{placeholder}</StyledTitle>
            <Input
              name={name}
              type={type}
              value={formValues[name]}
              onChange={onChange}
            />
          </Fragment>
        ))}
      </List>
      <Button type="submit">{submitButtonText}</Button>
    </StyledForm>
  );
};

export default Form;
