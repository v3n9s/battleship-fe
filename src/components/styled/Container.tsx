import styled from 'styled-components';

const Container = styled.div<{ maxWidth: number }>`
  margin: 0px auto;
  max-width: ${(props) => props.maxWidth}px;
`;

export default Container;
