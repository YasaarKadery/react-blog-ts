import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import './styles/ErrorPage.css'

export default function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="error">
        <h1>Oops!</h1>
        <h2 className="error-status">{error.status}</h2>
        <p className="error-status-text">{error.statusText}</p>
        {error.data?.message && <p className="not-found">{error.data.message}</p>}
      </div>
    );
  } else {
    return <div>Oops</div>;
  }
}