export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 20,
        borderTop: "1px solid #eee",
        paddingTop: 10,
        fontSize: "0.9em",
        color: "#666",
      }}
    >
      <div style={{ marginTop: 8 }}>
        © {new Date().getFullYear()} Fastro Development
      </div>
    </footer>
  );
}
