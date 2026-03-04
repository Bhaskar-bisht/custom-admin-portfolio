/** @format */

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../store/slices/authSlice";

export default function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const { isAuthenticated, token, initialized } = useSelector((s) => s.auth);

    useEffect(() => {
        if (token && !isAuthenticated) {
            dispatch(getMe());
        }
    }, [token]);

    if (!initialized && token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="space-y-3 text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!token || !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
