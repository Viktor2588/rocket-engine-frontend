import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Collapse, Typography, Box } from '@mui/material';
import { Close, ExpandMore, ExpandLess, ContentCopy } from '@mui/icons-material';

// Create context
const ToastContext = createContext(null);

// Generate unique ID
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Parse ProblemDetail response from API errors
 */
export function parseProblemDetail(error) {
  // Check if it's an Axios error with response data
  const responseData = error?.response?.data;
  const status = error?.response?.status || 500;
  const requestId = error?.response?.headers?.['x-request-id'] ||
                    responseData?.requestId ||
                    null;

  // RFC 7807 ProblemDetail format
  if (responseData && typeof responseData === 'object') {
    if (responseData.title || responseData.type) {
      return {
        title: responseData.title || 'Error',
        message: responseData.detail || responseData.message || 'An error occurred',
        status: responseData.status || status,
        requestId,
        errors: responseData.errors || [],
        path: responseData.path,
        timestamp: responseData.timestamp,
      };
    }
    // Legacy error format
    if (responseData.message) {
      return {
        title: getStatusTitle(status),
        message: responseData.message,
        status,
        requestId,
        errors: responseData.validationErrors ?
          Object.entries(responseData.validationErrors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : [],
      };
    }
  }

  // Fallback for network errors or unknown formats
  return {
    title: getStatusTitle(status),
    message: error?.message || 'An unexpected error occurred',
    status,
    requestId,
    errors: [],
  };
}

function getStatusTitle(status) {
  const titles = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Validation Error',
    429: 'Too Many Requests',
    500: 'Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return titles[status] || 'Error';
}

/**
 * Toast Provider - Provides toast notification functionality
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [expandedToasts, setExpandedToasts] = useState({});

  // Add a toast
  const showToast = useCallback((options) => {
    const toast = {
      id: generateId(),
      severity: 'info',
      autoHideDuration: 6000,
      ...options,
    };
    setToasts(prev => [...prev, toast]);
    return toast.id;
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return showToast({ message, severity: 'success', ...options });
  }, [showToast]);

  const showError = useCallback((message, options = {}) => {
    return showToast({
      message,
      severity: 'error',
      autoHideDuration: null, // Errors require manual dismiss
      ...options
    });
  }, [showToast]);

  const showWarning = useCallback((message, options = {}) => {
    return showToast({ message, severity: 'warning', ...options });
  }, [showToast]);

  const showInfo = useCallback((message, options = {}) => {
    return showToast({ message, severity: 'info', ...options });
  }, [showToast]);

  // Show error from API response (ProblemDetail)
  const showApiError = useCallback((error) => {
    const problemDetail = parseProblemDetail(error);

    let details = '';
    if (problemDetail.errors && problemDetail.errors.length > 0) {
      details = problemDetail.errors
        .map(e => `${e.field}: ${e.message}`)
        .join('\n');
    }

    return showToast({
      title: problemDetail.title,
      message: problemDetail.message,
      severity: 'error',
      requestId: problemDetail.requestId,
      details,
      autoHideDuration: null, // Errors require manual dismiss
    });
  }, [showToast]);

  // Remove a toast
  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    setExpandedToasts(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  // Toggle expanded state
  const toggleExpanded = useCallback((id) => {
    setExpandedToasts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  // Copy request ID to clipboard
  const copyRequestId = useCallback(async (requestId) => {
    try {
      await navigator.clipboard.writeText(requestId);
      showSuccess('Request ID copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [showSuccess]);

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showApiError,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Render all toasts */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.autoHideDuration}
          onClose={() => hideToast(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: { xs: 90 + index * 100, sm: 24 + index * 100 },
            maxWidth: '500px'
          }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%', alignItems: 'flex-start' }}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {toast.details && (
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={() => toggleExpanded(toast.id)}
                  >
                    {expandedToasts[toast.id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => hideToast(toast.id)}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            }
          >
            {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
            {toast.message}

            {/* Request ID for error tracing */}
            {toast.requestId && (
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}
              >
                <Typography variant="caption" component="span">
                  Request ID: {toast.requestId}
                </Typography>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => copyRequestId(toast.requestId)}
                  sx={{ p: 0.25 }}
                >
                  <ContentCopy sx={{ fontSize: '0.875rem' }} />
                </IconButton>
              </Box>
            )}

            {/* Expandable details */}
            <Collapse in={expandedToasts[toast.id]}>
              {toast.details && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {toast.details}
                </Box>
              )}
            </Collapse>
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast functionality
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
