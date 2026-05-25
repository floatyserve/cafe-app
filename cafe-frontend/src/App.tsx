import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {ThemeProvider} from './components/ThemeProvider';
import AppLayout from './components/layout/AppLayout';
import WaiterPage from './pages/WaiterPage';
import KitchenPage from './pages/KitchenPage';
import BarPage from './pages/BarPage';
import SettingsPage from "./pages/SettingsPage.tsx";
import TableViewPage from "./pages/TableViewPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import { authService } from "./api";
import { OrdersProvider } from "./context/OrdersContext";

function LoginRedirect() {
    return authService.isAuthenticated() ? <Navigate to="/waiter" replace /> : <LoginPage />;
}

export default function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="cafe-ui-theme">
            <OrdersProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginRedirect/>}/>
                        
                        <Route element={<ProtectedRoute />}>
                            <Route element={<AppLayout/>}>
                                <Route path="/" element={<Navigate to="/waiter" replace/>}/>

                                <Route path="/waiter" element={<WaiterPage/>}/>
                                <Route path="/kitchen" element={<KitchenPage/>}/>
                                <Route path="/bar" element={<BarPage/>}/>
                                <Route path="/table-view" element={<TableViewPage/>}/>
                                <Route path="/settings" element={<SettingsPage/>}/>
                            </Route>
                        </Route>

                        <Route path="*" element={<Navigate to="/waiter" replace />} />
                    </Routes>
                </BrowserRouter>
            </OrdersProvider>
        </ThemeProvider>
    );
}