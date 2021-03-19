import React from 'react';

import ErrorScreen from '../components/screens/ErrorScreen';

// This component catches all other uncatched errors, including
// those occuring in the Redux store.

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <ErrorScreen />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
