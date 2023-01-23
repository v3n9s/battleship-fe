import styled from 'styled-components';

const Input = styled.input.attrs<
  {
    isLoading?: boolean | undefined;
  },
  {
    disabled: boolean | undefined;
    isLoading: boolean;
  }
>((props) => ({
  disabled: props.disabled ?? props.isLoading,
  isLoading: props.isLoading ?? false,
}))`
  font-size: 25px;
  background-color: ${(props) =>
    props.isLoading
      ? props.theme.inputLoadingColor
      : props.theme.secondaryColor};
  color: ${(props) => props.theme.backgroundColor};
  transition: background-color 0.15s linear;
`;

export default Input;
