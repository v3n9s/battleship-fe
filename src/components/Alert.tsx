import { FC, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { AnimationState, useAnimation } from '../hooks/animation';
import { useStore } from '../hooks/store';

const opacityAnimation = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const expandAnimation = keyframes`
  0% {
    margin: -43px 0px 0px;
  }

  100% {
    margin: 0px;
  }
`;

const StyledAlert = styled.div<{ state: AnimationState }>`
  padding: 5px;
  font-size: 20px;
  background-color: ${(props) => props.theme.primaryColor};
  user-select: none;
  pointer-events: auto;
  animation: ${(props) =>
    props.state === 'entering'
      ? css`
          ${opacityAnimation} 0.2s 0.2s backwards, ${expandAnimation} 0.2s backwards
        `
      : props.state === 'exiting'
      ? css`
          ${opacityAnimation} 0.2s reverse both, ${expandAnimation} 0.3s 0.1s reverse forwards
        `
      : 'none'};

  &:hover {
    cursor: pointer;
  }
`;

const Alert: FC<{ alert: { id: string; text: string; isShowed: boolean } }> = ({
  alert,
}) => {
  const { dispatch } = useStore();

  const ref = useRef<HTMLDivElement>(null);

  const onExit = () => {
    dispatch({ type: 'RemoveAlert', payload: { id: alert.id } });
  };

  const { state, exit } = useAnimation(ref, onExit);

  const hide = () => {
    dispatch({ type: 'HideAlert', payload: { id: alert.id } });
  };

  useEffect(() => {
    if (!alert.isShowed) {
      exit();
    }
  }, [alert.isShowed, exit]);

  return (
    <StyledAlert onClick={hide} state={state} ref={ref}>
      {alert.text}
    </StyledAlert>
  );
};

export default Alert;
