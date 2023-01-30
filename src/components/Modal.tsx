import { FC, ReactNode, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { AnimationState, useAnimation } from '../hooks/animation';

const StyledWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

const opacityAnimation = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const StyledOverlay = styled.div<{ state: AnimationState }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.overlayColor};
  animation: ${(props) =>
    props.state === 'entering'
      ? css`
          ${opacityAnimation} 0.25s
        `
      : props.state === 'exiting'
      ? css`
          ${opacityAnimation} 0.25s 0.35s reverse forwards
        `
      : 'none'};
`;

const StyledModal = styled.div`
  position: relative;
  padding: 0px 10px;
  pointer-events: none;
`;

const translateAnimation = keyframes`
  0% {
    transform: translateY(-150px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const StyledModalBody = styled.div<{
  maxWidth?: number | undefined;
  state: AnimationState;
}>`
  margin: 10px auto;
  max-width: ${(props) =>
    props.maxWidth ? props.maxWidth : props.theme.mainContainerMaxWidth}px;
  max-height: calc(100vh - 20px);
  padding: 10px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
  animation: ${(props) =>
    props.state === 'entering'
      ? css`
          ${translateAnimation} 0.5s, ${opacityAnimation} 0.5s 0.1s backwards
        `
      : props.state === 'exiting'
      ? css`
          ${translateAnimation} 0.5s reverse forwards, ${opacityAnimation} 0.5s reverse forwards
        `
      : 'none'};
  pointer-events: auto;
  overflow-y: auto;
`;

const Modal: FC<{
  children: ReactNode;
  onClose: () => void;
  maxWidth?: number | undefined;
  isOpen: boolean;
}> = ({ children, isOpen, onClose, maxWidth }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { state, exit } = useAnimation(parentRef, onClose);

  useEffect(() => {
    if (!isOpen) {
      exit();
    }
  }, [isOpen, exit]);

  return (
    <StyledWrapper ref={parentRef}>
      <StyledOverlay onClick={exit} state={state} />
      <StyledModal>
        <StyledModalBody maxWidth={maxWidth} state={state}>
          {children}
        </StyledModalBody>
      </StyledModal>
    </StyledWrapper>
  );
};

export default Modal;
