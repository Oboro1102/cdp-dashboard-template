function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-yellow-100">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;
