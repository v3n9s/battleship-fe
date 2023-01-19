import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

const StyledOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.overlayColor};
`;

const StyledModal = styled.div`
  position: relative;
  padding: 0px 10px;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

const Modal: FC<{ children: ReactNode; closeModal: () => void }> = ({
  children,
  closeModal,
}) => {
  return (
    <>
      <StyledWrapper>
        <StyledOverlay onClick={closeModal} />
        <StyledModal>{children}</StyledModal>
      </StyledWrapper>
    </>
  );
};

export default Modal;
