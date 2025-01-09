import "../styles/NotFoundPage.scss"

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Oops! The page you are looking for does not exist.
      </p>
      <img
        src="https://via.placeholder.com/400"
        alt="Not Found Illustration"
        className="not-found-image"
      />
      <a href="/" className="not-found-link">
        Go back to Home
      </a>
    </div>
  );
};

export default NotFoundPage;
