import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeContextProvider } from './context/ThemeContext.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeContextProvider>
                <App />
            </ThemeContextProvider>
        </BrowserRouter>
    </Provider>,
)