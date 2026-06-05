const fs = require("fs");
const path = require("path");

async function main() {
  const filePath = path.join(__dirname, "CV M. Soni Juliansyah .pdf");
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: "application/pdf" });
  const file = new File([blob], "CV M. Soni Juliansyah .pdf", { type: "application/pdf" });

  const formData = new FormData();
  formData.append("cv", file);
  formData.append("jobPosition", "Frontend Developer");

  console.log("Sending request to http://localhost:3000/api/analyze...");
  try {
    const response = await fetch("http://localhost:3000/api/analyze", {
      method: "POST",
      body: formData,
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    const text = await response.text();
    console.log("Response text:");
    try {
      console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      console.log(text);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

main();
