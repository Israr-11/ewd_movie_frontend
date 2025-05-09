/**
 * Simple Notification Service
 * 
 * Creates notifications that appear on the top right side of the screen
 * and automatically disappear after 3 seconds.
 */

// Initialize notification container
const initContainer = (): HTMLDivElement => {
  // First, remove any existing container to start fresh
  const existingContainer = document.getElementById('notification-container');
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }
  
  // Create a new container
  const container = document.createElement('div');
  container.id = 'notification-container';
  
  // Set styles directly
  Object.assign(container.style, {
    position: 'fixed',
    top: '70px',
    right: '20px',
    zIndex: '99999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    pointerEvents: 'none'
  });
  
  document.body.appendChild(container);
  return container;
};

// Create and show a notification
const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning'): void => {
  const container = initContainer();
  
  // Create notification element
  const notification = document.createElement('div');
  
  // Set styles directly
  Object.assign(notification.style, {
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '10px',
    minWidth: '250px',
    maxWidth: '350px',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    opacity: '0',
    transition: 'opacity 0.3s, transform 0.3s',
    transform: 'translateY(-20px)'
  });
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#4caf50';
      break;
    case 'error':
      notification.style.backgroundColor = '#f44336';
      break;
    case 'info':
      notification.style.backgroundColor = '#2196f3';
      break;
    case 'warning':
      notification.style.backgroundColor = '#ff9800';
      break;
  }
  
  notification.textContent = message;
  
  // Add to container
  container.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    
    // Remove from DOM after transition
    setTimeout(() => {
      if (container.contains(notification)) {
        container.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Notification functions
export const showSuccess = (message: string): void => {
  console.log('✅ Success:', message);
  showNotification(message, 'success');
};

export const showError = (message: string): void => {
  console.error('❌ Error:', message);
  showNotification(message, 'error');
};

export const showInfo = (message: string): void => {
  console.info('ℹ️ Info:', message);
  showNotification(message, 'info');
};

export const showWarning = (message: string): void => {
  console.warn('⚠️ Warning:', message);
  showNotification(message, 'warning');
};

// Default export for convenience
const notificationService = {
  success: showSuccess,
  error: showError,
  info: showInfo,
  warning: showWarning
};

export default notificationService;
