import BackButton from "../components/BackButton";

export default function PageLayout({ children }) {
  return (
    <div style={{ padding: "20px" }}>
      <BackButton />
      {children}
    </div>
  );
}
