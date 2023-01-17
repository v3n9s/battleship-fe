import 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;

    mainContainerMaxWidth: number;
  }
}

export const theme: DefaultTheme = {
  primaryColor: '#a00',
  secondaryColor: '#fff',
  backgroundColor: '#000',
  mainContainerMaxWidth: 1024,
};
