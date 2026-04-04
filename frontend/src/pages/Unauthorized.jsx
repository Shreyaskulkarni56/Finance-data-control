export default function Unauthorized() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
            </div>
        </div>
    );
}