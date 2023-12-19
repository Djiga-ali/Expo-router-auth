exports.emailValidation = (req, res, country, language) => {
  if (country === "Burundi" && language === "Ikirundi") {
    res.status(400);
    throw new Error("BDI: email is required");
  } else if (country === "Burundi" && language === "Kiswahili") {
    res.status(400);
    throw new Error("BDI-ksw: email is required");
  } else if (country === "Burundi" && language === "Français") {
    res.status(400);
    throw new Error("BDI-fr: email is required");

    // Rwanda  ********************
  } else if (country === "Rwanda" && language === "Ikinyarwanda") {
    res.status(400);
    throw new Error("RWD: email is required");
  } else if (country === "Rwanda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RWD-ksw: email is required");
  } else if (country === "Rwanda" && language === "English") {
    res.status(400);
    throw new Error("RWD-eng: email is required");

    // RDC *********************************
  } else if (country === "RDC" && language === "Lingala") {
    res.status(400);
    throw new Error("RDC-LNGL: email is required");
  } else if (country === "RDC" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RDC-ksw: email is required");
  } else if (country === "RDC" && language === "Français") {
    res.status(400);
    throw new Error("RDC-fr: email is required");

    //   Tanzanie ******************
  } else if (country === "Tanzania" && language === "Kiswahili") {
    res.status(400);
    throw new Error("TZ-ksw: email is required");
  } else if (country === "Tanzania" && language === "English") {
    res.status(400);
    throw new Error("TZ-eng: email is required");

    // Kenya ****************************
  } else if (country === "Kenya" && language === "Kiswahili") {
    res.status(400);
    throw new Error("KNY-ksw: email is required");
  } else if (country === "Kenya" && language === "English") {
    res.status(400);
    throw new Error("KNY-eng: email is required");

    // Uganda
  } else if (country === "Uganda" && language === "Luganda") {
    res.status(400);
    throw new Error("UDG-Lgnd: email is required");
  } else if (country === "Uganda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("UDG-ksw: email is required");
  } else if (country === "Uganda" && language === "English") {
    res.status(400);
    throw new Error("UDG-eng: email is required");

    // Soudan du sud
  } else if (country === "South Sudan" && language === "Kiswahili") {
    res.status(400);
    throw new Error("SS-ksw: email is required");
  } else if (country === "South Sudan" && language === "English") {
    res.status(400);
    throw new Error("SS-eng: email is required");
  } else {
    res.status(400);
    throw new Error("Kiswahili: email is required");
  }
};
