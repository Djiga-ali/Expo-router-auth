// Last-name

exports.lastNameValidation = (req, res, country, language) => {
  if (country === "Burundi" && language === "Ikirundi") {
    res.status(400);
    throw new Error("BDI: last_name is required");
  } else if (country === "Burundi" && language === "Kiswahili") {
    res.status(400);
    throw new Error("BDI-ksw: last_name is required");
  } else if (country === "Burundi" && language === "Français") {
    res.status(400);
    throw new Error("BDI-fr: last_name is required");

    // Rwanda  ********************
  } else if (country === "Rwanda" && language === "Ikinyarwanda") {
    res.status(400);
    throw new Error("RWD: last_name is required");
  } else if (country === "Rwanda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RWD-ksw: last_name is required");
  } else if (country === "Rwanda" && language === "English") {
    res.status(400);
    throw new Error("RWD-eng: last_name is required");

    // RDC *********************************
  } else if (country === "RDC" && language === "Lingala") {
    res.status(400);
    throw new Error("RDC-LNGL: last_name is required");
  } else if (country === "RDC" && language === "Kiswahili") {
    res.status(400);
    throw new Error("RDC-ksw: last_name is required");
  } else if (country === "RDC" && language === "Français") {
    res.status(400);
    throw new Error("RDC-fr: last_name is required");

    //   Tanzanie ******************
  } else if (country === "Tanzania" && language === "Kiswahili") {
    res.status(400);
    throw new Error("TZ-ksw: last_name is required");
  } else if (country === "Tanzania" && language === "English") {
    res.status(400);
    throw new Error("TZ-eng: last_name is required");

    // Kenya ****************************
  } else if (country === "Kenya" && language === "Kiswahili") {
    res.status(400);
    throw new Error("KNY-ksw: last_name is required");
  } else if (country === "Kenya" && language === "English") {
    res.status(400);
    throw new Error("KNY-eng: last_name is required");

    // Uganda
  } else if (country === "Uganda" && language === "Luganda") {
    res.status(400);
    throw new Error("UDG-Lgnd: last_name is required");
  } else if (country === "Uganda" && language === "Kiswahili") {
    res.status(400);
    throw new Error("UDG-ksw: last_name is required");
  } else if (country === "Uganda" && language === "English") {
    res.status(400);
    throw new Error("UDG-eng: last_name is required");

    // Soudan du sud
  } else if (country === "South Sudan" && language === "Kiswahili") {
    res.status(400);
    throw new Error("SS-ksw: last_name is required");
  } else if (country === "South Sudan" && language === "English") {
    res.status(400);
    throw new Error("SS-eng: last_name is required");
  } else {
    res.status(400);
    throw new Error("Kiswahili: last_name is required");
  }
};
