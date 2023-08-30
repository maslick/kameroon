import styled, { keyframes, css } from "styled-components";

const flashAnimation = keyframes`
  from {
    opacity: 0.75;
  }

  to {
    opacity: 0;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 320px;
  //height: 430px;
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
   // max-width: ${({ maxWidth }) => maxWidth && `${maxWidth}px`};
   // max-height: ${({ maxHeight }) => maxHeight && `${maxHeight}px`};
  overflow: hidden;
`;

export const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const Video = styled.video`
  position: absolute;
  display: none;

  &::-webkit-media-controls-play-button {
    display: none !important;
    -webkit-appearance: none;
  }
`;

export const Flash = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  opacity: 0;

  ${({ flash }) => {
    if (flash) {
      return css`
        animation: ${flashAnimation} 1750ms ease-out;
      `;
    }
  }}
`;

export const Button = styled.button`
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 15px 15px;
  margin-bottom: 3px;
  font-size: 16px;
  border-radius: 8px;
  width: 130px;
`;
