import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
          <h1 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mb-4 max-w-md text-center">
            {this.state.error?.message || "An error occurred while loading this page."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
