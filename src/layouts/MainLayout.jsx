function MainLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0d0d0d",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          padding: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
