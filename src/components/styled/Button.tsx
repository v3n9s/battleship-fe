import styled, { css } from 'styled-components';

const Button = styled.button.attrs<
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
  display: block;
  padding: 5px;
  font-size: 20px;
  color: ${(props) => props.theme.secondaryColor};
  border: 2px solid
    ${(props) =>
      props.isLoading ? props.theme.loadingColor : props.theme.primaryColor};
  background-color: ${(props) =>
    props.isLoading ? props.theme.loadingColor : props.theme.primaryColor};
  transition: background-color 0.15s linear, border 0.15s linear;

  ${(props) =>
    props.isLoading
      ? ''
      : css`
          &:hover {
            background-color: ${(props) => props.theme.backgroundColor};
            cursor: pointer;
          }
        `}
`;

export default Button;
