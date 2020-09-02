import * as React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Main from "./Main";
/*
const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#009be5',
        background: '#eaeff1',
        text: '#fff',
        surface: '#232f3e'
    }
}
*/
const App = () => {
    return (
        <PaperProvider>
            <Main />
        </PaperProvider>
    );
}

export default App;