export default function LabPanel() {
  return (
    <div className="lab-panel">
      <h1>Tryb laboratoryjny</h1>

      <LabSampleForm />
      <LabSampleList />
    </div>
  );
}
