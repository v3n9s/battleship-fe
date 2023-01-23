import 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    loadingColor: string;
    inputLoadingColor: string;
    overlayColor: string;

    mainContainerMaxWidth: number;
  }
}

export const theme: DefaultTheme = {
  primaryColor: '#a00',
  secondaryColor: '#fff',
  backgroundColor: '#000',
  loadingColor: '#555',
  inputLoadingColor: '#aaa',
  overlayColor: '#000000cc',
  mainContainerMaxWidth: 1024,
};
