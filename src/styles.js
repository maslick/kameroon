import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  div#root {
    height: 100%;
  }
`;

export const Root = styled.main`
  display: flex;
  flex-flow: column;
  align-items: center;
  text-align: center;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 50px 0 50px;
`;

export const Result = styled.div`
  width: 100%;
  height: auto;
  padding: 0 20px;
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
`;
