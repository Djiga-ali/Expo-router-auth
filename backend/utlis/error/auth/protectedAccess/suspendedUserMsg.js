exports.suspendedUserMsg = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res.status(400).json({ message: `BDI: You are supended ` });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res.status(400).json({ message: `BDI-sw: You are supended ` });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res.status(400).json({ message: `BDI-fr: You are supended ` });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res.status(400).json({ message: `RWD: You are supended ` });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res.status(400).json({ message: `RWD-sw: You are supended ` });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res.status(400).json({ message: `RWD-eng: You are supended ` });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res.status(400).json({ message: `RDC-Lngl: You are supended ` });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res.status(400).json({ message: `RDC-sw: You are supended ` });
  } else if (user.country === "RDC" && user.language === "Français") {
    res.status(400).json({ message: `RDC-fr: You are supended ` });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res.status(400).json({ message: `TZ-eng: You are supended ` });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res.status(400).json({ message: `TZ-sw: You are supended ` });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res.status(400).json({ message: `UD-lga: You are supended ` });
  } else if (user.country === "Uganda" && user.language === "English") {
    res.status(400).json({ message: `UD-eng: You are supended ` });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res.status(400).json({ message: `UD-sw: You are supended ` });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res.status(400).json({ message: `KNY-eng: You are supended ` });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res.status(400).json({ message: `KNY-sw: You are supended ` });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res.status(400).json({ message: `SS-eng: You are supended ` });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res.status(400).json({ message: `SS-sw: You are supended ` });
  } else {
    res.status(400);
    throw new Error("KSW: something goes wrong");
  }
};
