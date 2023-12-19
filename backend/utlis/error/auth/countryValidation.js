exports.countryValidation = (req, res, country, language) => {
  if (country === "Burundi" && language === "Ikirundi") {
    res.status(400);
    throw new Error("BDI: country is required");
  } else if (country === "Burundi" && language === "Kiswahili") {
    res.status(400);
    throw new Error("BDI-ksw: country is required");
  } else if (country === "Burundi" && language === "Français") {
    res.status(400);
    throw new Error("BDI-fr: country is required");

    // Rwanda  ********************
  } else if (country === "Rwanda" && language === "Ikinyarwanda") {
    res.status(400);
    throw new Error("RWD: country is required");
  } else if (country === "Rwanda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RWD-ksw: country is required");
  } else if (country === "Rwanda" && language === "English") {
    res.status(400);
    throw new Error("RWD-eng: country is required");

    // RDC *********************************
  } else if (country === "RDC" && language === "Lingala") {
    res.status(400);
    throw new Error("RDC-LNGL: country is required");
  } else if (country === "RDC" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RDC-ksw: country is required");
  } else if (country === "RDC" && language === "Français") {
    res.status(400);
    throw new Error("RDC-fr: country is required");

    //   Tanzanie ******************
  } else if (country === "Tanzania" && language === "Kiswahili") {
    res.status(400);
    throw new Error("TZ-ksw: country is required");
  } else if (country === "Tanzania" && language === "English") {
    res.status(400);
    throw new Error("TZ-eng: country is required");

    // Kenya ****************************
  } else if (country === "Kenya" && language === "Kiswahili") {
    res.status(400);
    throw new Error("KNY-ksw: country is required");
  } else if (country === "Kenya" && language === "English") {
    res.status(400);
    throw new Error("KNY-eng: country is required");

    // Uganda
  } else if (country === "Uganda" && language === "Luganda") {
    res.status(400);
    throw new Error("UDG-Lgnd: country is required");
  } else if (country === "Uganda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("UDG-ksw: country is required");
  } else if (country === "Uganda" && language === "English") {
    res.status(400);
    throw new Error("UDG-eng: country is required");

    // Soudan du sud
  } else if (country === "South Sudan" && language === "Kiswahili") {
    res.status(400);
    throw new Error("SS-ksw: country is required");
  } else if (country === "South Sudan" && language === "English") {
    res.status(400);
    throw new Error("SS-eng: country is required");
  } else {
    res.status(400);
    throw new Error("EAC-SW: country is required");
  }
};
