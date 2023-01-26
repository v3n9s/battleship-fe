import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

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

const StyledOverlay = styled.div<{ state: ModalState }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.overlayColor};
  animation: ${(props) =>
    props.state === 'opening'
      ? css`
          ${opacityAnimation} 0.25s
        `
      : props.state === 'closing'
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
  state: ModalState;
}>`
  margin: 10px auto;
  max-width: ${(props) =>
    props.maxWidth ? props.maxWidth : props.theme.mainContainerMaxWidth}px;
  max-height: calc(100vh - 20px);
  padding: 10px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.primaryColor};
  animation: ${(props) =>
    props.state === 'opening'
      ? css`
          ${translateAnimation} 0.5s, ${opacityAnimation} 0.5s 0.1s backwards
        `
      : props.state === 'closing'
      ? css`
          ${translateAnimation} 0.5s reverse forwards, ${opacityAnimation} 0.5s reverse forwards
        `
      : 'none'};
  pointer-events: auto;
  overflow-y: auto;
`;

type ModalState = 'opening' | 'opened' | 'closing';

const Modal: FC<{
  children: ReactNode;
  onClose: () => void;
  maxWidth?: number | undefined;
  isOpen: boolean;
}> = ({ children, isOpen, onClose, maxWidth }) => {
  const [state, setState] = useState<ModalState>('opening');

  const overlayRef = useRef<HTMLDivElement>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'opening' || state === 'closing') {
      const elem = state === 'opening' ? modalRef.current : overlayRef.current;
      if (elem) {
        const cb = () => {
          if (state === 'opening') {
            setState('opened');
          } else {
            onClose();
          }
        };
        elem.addEventListener('animationend', cb, { once: true });
        return () => {
          elem.removeEventListener('animationend', cb);
        };
      }
    }
  }, [state, onClose]);

  const close = useCallback(() => {
    if (state === 'opened') {
      setState('closing');
    }
  }, [state]);

  useEffect(() => {
    if (!isOpen) {
      close();
    }
  }, [isOpen, close]);

  return (
    <StyledWrapper>
      <StyledOverlay ref={overlayRef} onClick={close} state={state} />
      <StyledModal>
        <StyledModalBody ref={modalRef} maxWidth={maxWidth} state={state}>
          {children}
        </StyledModalBody>
      </StyledModal>
    </StyledWrapper>
  );
};

export default Modal;
