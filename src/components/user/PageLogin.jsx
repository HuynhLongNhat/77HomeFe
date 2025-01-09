import Login from "./Login";

const PageLogin = () => {
  return (
    <div
      className="page-login-container"
      style={{
        minHeight: "100vh",
        background:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="content-wrapper"
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Left side - Welcome Text */}
        <div
          className="welcome-section"
          style={{
            flex: "1",
            color: "white",
            display: "none",
            "@media (min-width: 992px)": {
              display: "block",
            },
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Welcome to HomeStay
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
            Find your perfect rental home with our easy-to-use platform. Browse
            through carefully curated properties and connect with trusted
            landlords.
          </p>
          <div className="features" style={{ marginTop: "2rem" }}>
            <div className="feature" style={{ marginBottom: "1rem" }}>
              ✓ Verified properties
            </div>
            <div className="feature" style={{ marginBottom: "1rem" }}>
              ✓ Secure payments
            </div>
            <div className="feature" style={{ marginBottom: "1rem" }}>
              ✓ 24/7 support
            </div>
          </div>
        </div>

        {/* Right side - Login Component */}
        <div
          className="login-section"
          style={{
            flex: "1",
            maxWidth: "450px",
            margin: "0 auto",
          }}
        >
          <Login />
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
