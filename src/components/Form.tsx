import {
  ChangeEvent,
  FormEvent,
  HTMLInputTypeAttribute,
  ReactElement,
  useCallback,
  useState,
} from 'react';

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
    <form onSubmit={onSubmit}>
      {Object.entries(fields).map(([name, { type, placeholder }]) => (
        <div key={name}>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            value={formValues[name]}
            onChange={onChange}
          />
          <br />
        </div>
      ))}
      <button type="submit">{submitButtonText}</button>
    </form>
  );
};

export default Form;
