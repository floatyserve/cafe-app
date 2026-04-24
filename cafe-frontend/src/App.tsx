import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider} from './components/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import WaiterPage from './pages/WaiterPage';
import KitchenPage from './pages/KitchenPage';
import BarPage from './pages/BarPage';
import SettingsPage from "./pages/SettingsPage.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="cafe-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout/>}>
                        <Route path="/" element={<Navigate to="/waiter" replace/>}/>

                        <Route path="/waiter" element={<WaiterPage/>}/>
                        <Route path="/kitchen" element={<KitchenPage/>}/>
                        <Route path="/bar" element={<BarPage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;