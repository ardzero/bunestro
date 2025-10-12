// only use this if a react component might throw an error in production
// just wrap the component in the ErrorBoundary component
import {
	Component,
	type ErrorInfo,
	type ReactNode,
	type ComponentType,
} from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface Props {
	children: ReactNode;
	fallback?:
		| ReactNode
		| ((props: { error: Error | undefined; reset: () => void }) => ReactNode);
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	private handleRetry = () => {
		this.setState({ hasError: false, error: undefined });
	};

	public render() {
		if (this.state.hasError) {
			// You can customize this default fallback UI
			const defaultFallback = (
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
					<h2 className="text-lg font-semibold text-destructive">
						Something went wrong
					</h2>
					<p className="mt-1 text-sm text-muted-foreground">
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<Button variant="outline" className="mt-4" onClick={this.handleRetry}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				</div>
			);

			if (typeof this.props.fallback === "function") {
				return this.props.fallback({
					error: this.state.error,
					reset: this.handleRetry,
				});
			}

			return this.props.fallback || defaultFallback;
		}

		return this.props.children;
	}
}

export function withErrorBoundary<P extends object>(
	WrappedComponent: ComponentType<P>,
	fallback?: React.ReactNode,
) {
	return function WithErrorBoundaryComponent(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<WrappedComponent {...props} />
			</ErrorBoundary>
		);
	};
}
