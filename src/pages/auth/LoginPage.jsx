/** @format */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginAdmin, clearError } from "../../store/slices/authSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/", { replace: true });
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(clearError());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginAdmin(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-muted-foreground">&lt;</span>
                        bhaskar
                        <span className="text-muted-foreground">/&gt;</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">Admin Panel</p>
                </div>
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Sign in to continue</CardTitle>
                        <CardDescription className="text-xs">Enter your admin credentials</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        className="pl-8 h-9 text-sm"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-8 pr-9 h-9 text-sm"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPass ? (
                                            <EyeOff className="w-3.5 h-3.5" />
                                        ) : (
                                            <Eye className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <p className="text-center text-xs text-muted-foreground">Portfolio Admin — Protected Area</p>
            </div>
        </div>
    );
}
