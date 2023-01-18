import styled from 'styled-components';

const Input = styled.input`
  font-size: 25px;
  background-color: ${(props) => props.theme.secondaryColor};
  color: ${(props) => props.theme.backgroundColor};
`;

export default Input;
