exports.firstNameValidation = (req, res, country, language) => {
  // Burundi ******************
  if (country === "Burundi" && language === "Ikirundi") {
    res.status(400);
    throw new Error("BDI: first_name is required");
    //   throw new Error("BDI: first_name is required");
  } else if (country === "Burundi" && language === "Kiswahili") {
    res.status(400);
    throw new Error("BDI-ksw: first_name is required");
  } else if (country === "Burundi" && language === "Français") {
    res.status(400);
    throw new Error("BDI-fr: first_name is required");
    // Rwanda  ********************
  } else if (country === "Rwanda" && language === "Ikinyarwanda") {
    res.status(400);
    throw new Error("RWD: first_name is required");
  } else if (country === "Rwanda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RWD-ksw: first_name is required");
  } else if (country === "Rwanda" && language === "English") {
    res.status(400);
    throw new Error("RWD-eng: first_name is required");
    // RDC *********************************
  } else if (country === "RDC" && language === "Lingala") {
    res.status(400);
    throw new Error("RDC-LNGL: first_name is required");
  } else if (country === "RDC" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RDC-ksw: first_name is required");
  } else if (country === "RDC" && language === "Français") {
    res.status(400);
    throw new Error("RDC-fr: first_name is required");
    //   Tanzanie ******************
  } else if (country === "Tanzania" && language === "Kiswahili") {
    res.status(400);
    throw new Error("TZ-ksw: first_name is required");
  } else if (country === "Tanzania" && language === "English") {
    res.status(400);
    throw new Error("TZ-eng: first_name is required");
    // Kenya ****************************
  } else if (country === "Kenya" && language === "Kiswahili") {
    res.status(400);
    throw new Error("KNY-ksw: first_name is required");
  } else if (country === "Kenya" && language === "English") {
    res.status(400);
    throw new Error("KNY-eng: first_name is required");
    // Uganda
  } else if (country === "Uganda" && language === "Luganda") {
    res.status(400);
    throw new Error("UDG-Lgnd: first_name is required");
  } else if (country === "Uganda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("UDG-ksw: first_name is required");
  } else if (country === "Uganda" && language === "English") {
    res.status(400);
    throw new Error("UDG-eng: first_name is required");
    // Soudan du sud
  } else if (country === "South Sudan" && language === "Kiswahili") {
    res.status(400);
    throw new Error("SS-ksw: first_name is required");
  } else if (country === "South Sudan" && language === "English") {
    res.status(400);
    throw new Error("SS-eng: first_name is required");
  } else {
    res.status(400);
    throw new Error("EAC-SW: first_name is required");
  }
};
