import {
  ChangeEvent,
  FormEvent,
  Fragment,
  HTMLInputTypeAttribute,
  ReactElement,
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

export type OnSubmitCallback<T extends { [k: string]: string }> = (
  fields: T,
  setValues: (values: T) => void,
) => void;

const Form = <
  T extends { [k: string]: Field },
  U extends { [K in keyof T]: string },
>({
  fields,
  onSubmit: onSubmitCallback,
  submitButtonText,
  isLoading = false,
}: {
  fields: T;
  onSubmit: OnSubmitCallback<U>;
  submitButtonText: string;
  isLoading?: boolean;
}): ReactElement => {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(
      Object.entries(fields).map(([k, { value }]) => [k, value]),
    ) as U,
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmitCallback(formValues, setFormValues);
  };

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
              isLoading={isLoading}
            />
          </Fragment>
        ))}
      </List>
      <Button type="submit" isLoading={isLoading}>
        {submitButtonText}
      </Button>
    </StyledForm>
  );
};

export default Form;
