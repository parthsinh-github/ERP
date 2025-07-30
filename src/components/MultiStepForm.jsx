import React, { useState } from "react";
import BankDetails from "./BankDetails";
import AcademicDetails from "./AcademicDetails"; 

const MultiStepForm = () => {
  const [step, setStep] = useState(1);

  return (
    <div style={styles.container}>
      {/* ✅ Step 1: Academic Form */}
      {step === 1 && (
        <div>
          <AcademicDetails /> 
          <button onClick={() => setStep(2)} style={styles.btn}>Next → Bank Details</button>
        </div>
      )}

      {/* ✅ Step 2: Bank Form */}
      {step === 2 && (
        <div>
          <BankDetails />
          {/* <button onClick={() => setStep(3)} style={styles.btn}>Next → Review</button> */}
        </div>
      )}

      {/* ✅ Step 3: Review */}
      {step === 3 && (
        <div style={styles.summary}>
          <h2>✅ Review Your Details</h2>
          <p>Here you can show submitted Academic & Bank details from backend or props.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", background: "#f4f6f9", minHeight: "100vh" },
  btn: { padding: "10px", marginTop: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
  summary: { background: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "600px", margin: "auto" },
};

export default MultiStepForm;
