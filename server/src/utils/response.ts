export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
    return {
        success: true,
        data,
        message,
    };
};

export const errorResponse = (message: string, error?: string): ApiResponse => {
    return {
        success: false,
        message,
        error,
    };
};
