import styled from "styled-components";


export const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 320px;
`;

export const Container = styled.div`
  position: relative;
  width: 100%;
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

export const Button = styled.button`
  background-color: #008CBA;
  border: none;
  color: white;
  padding: 15px 15px;
  margin: 3px 0;
  font-size: 16px;
  border-radius: 8px;
  width: 100px;
`;
