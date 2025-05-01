import React from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export function ErrorBoundary() {
    const error = useRouteError();

    // Determine what kind of error we're dealing with
    let errorMessage: string;
    let statusText: string = '';
    let status: number | undefined;

    if (isRouteErrorResponse(error)) {
        // This is a route error (like 404)
        statusText = error.statusText;
        status = error.status;
        errorMessage = error.data?.message || 'An unexpected error occurred';
    } else if (error instanceof Error) {
        // This is a JavaScript error
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        // This is a string error
        errorMessage = error;
    } else {
        // Fallback for unknown error types
        errorMessage = 'An unknown error occurred';
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="mb-4 text-2xl font-bold text-red-600">
                    {status ? `${status} - ${statusText}` : 'Error'}
                </h1>
                <p className="mb-6 text-gray-700">{errorMessage}</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 font-medium text-white bg-[#BD3A3A] rounded hover:bg-red-700"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default ErrorBoundary;