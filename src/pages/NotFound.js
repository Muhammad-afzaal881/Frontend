import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

function NotFound() {
  return (
    <div className="not-found-wrapper">
      <div className="not-found-content animate-in">
        {/* Visual Icon for 404 */}
        <div className="not-found-icon">
          <AlertCircle size={80} color="#6366f1" strokeWidth={1.5} />
        </div>

        <h1 className="error-code">404</h1>
        <h2 className="error-heading">Oops! Page Not Found</h2>
        
        <p className="error-message">
          This is not the page you are looking for
        </p>

        <div className="actions-wrapper">
          <Link to="/" className="back-home-btn">
            <Home size={20} style={{ marginRight: '8px' }} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;