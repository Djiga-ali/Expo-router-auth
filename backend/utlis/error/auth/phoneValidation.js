exports.phoneValidation = (req, res, country, language) => {
  // Burundi ******************
  if (country === "Burundi" && language === "Ikirundi") {
    res.status(400);
    throw new Error("BDI: phone is required");
    //   throw new Error("BDI: phone is required");
  } else if (country === "Burundi" && language === "Kiswahili") {
    res.status(400);
    throw new Error("BDI-ksw: phone is required");
  } else if (country === "Burundi" && language === "Français") {
    res.status(400);
    throw new Error("BDI-fr: phone is required");
    // Rwanda  ********************
  } else if (country === "Rwanda" && language === "Ikinyarwanda") {
    res.status(400);
    throw new Error("RWD: phone is required");
  } else if (country === "Rwanda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RWD-ksw: phone is required");
  } else if (country === "Rwanda" && language === "English") {
    res.status(400);
    throw new Error("RWD-eng: phone is required");
    // RDC *********************************
  } else if (country === "RDC" && language === "Lingala") {
    res.status(400);
    throw new Error("RDC-LNGL: phone is required");
  } else if (country === "RDC" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RDC-ksw: phone is required");
  } else if (country === "RDC" && language === "Français") {
    res.status(400);
    throw new Error("RDC-fr: phone is required");
    //   Tanzanie ******************
  } else if (country === "Tanzania" && language === "Kiswahili") {
    res.status(400);
    throw new Error("TZ-ksw: phone is required");
  } else if (country === "Tanzania" && language === "English") {
    res.status(400);
    throw new Error("TZ-eng: phone is required");
    // Kenya ****************************
  } else if (country === "Kenya" && language === "Kiswahili") {
    res.status(400);
    throw new Error("KNY-ksw: phone is required");
  } else if (country === "Kenya" && language === "English") {
    res.status(400);
    throw new Error("KNY-eng: phone is required");
    // Uganda
  } else if (country === "Uganda" && language === "Luganda") {
    res.status(400);
    throw new Error("UDG-Lgnd: phone is required");
  } else if (country === "Uganda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("UDG-ksw: phone is required");
  } else if (country === "Uganda" && language === "English") {
    res.status(400);
    throw new Error("UDG-eng: phone is required");
    // Soudan du sud
  } else if (country === "South Sudan" && language === "Kiswahili") {
    res.status(400);
    throw new Error("SS-ksw: phone is required");
  } else if (country === "South Sudan" && language === "English") {
    res.status(400);
    throw new Error("SS-eng: phone is required");
  } else {
    res.status(400);
    throw new Error("EAC-SW: phone is required");
  }
};
