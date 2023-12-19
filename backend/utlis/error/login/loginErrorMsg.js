exports.matchPasswordErrorMsg = (req, res, foundUser) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res.status(401).json({ message: `BDI: Email or password is incorrect ` });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res
      .status(401)
      .json({ message: `BDI-sw: Email or password is incorrect ` });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res
      .status(401)
      .json({ message: `BDI-fr: Email or password is incorrect ` });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res.status(401).json({ message: `RWD: Email or password is incorrect ` });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res
      .status(401)
      .json({ message: `RWD-sw: Email or password is incorrect ` });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res
      .status(401)
      .json({ message: `RWD-eng: Email or password is incorrect ` });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res
      .status(401)
      .json({ message: `RDC-Lngl: Email or password is incorrect ` });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res
      .status(401)
      .json({ message: `RDC-sw: Email or password is incorrect ` });
  } else if (user.country === "RDC" && user.language === "Français") {
    res
      .status(401)
      .json({ message: `RDC-fr: Email or password is incorrect ` });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res
      .status(401)
      .json({ message: `TZ-eng: Email or password is incorrect ` });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res.status(401).json({ message: `TZ-sw: Email or password is incorrect ` });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res
      .status(401)
      .json({ message: `UD-lga: Email or password is incorrect ` });
  } else if (user.country === "Uganda" && user.language === "English") {
    res
      .status(401)
      .json({ message: `UD-eng: Email or password is incorrect ` });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res.status(401).json({ message: `UD-sw: Email or password is incorrect ` });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res
      .status(401)
      .json({ message: `KNY-eng: Email or password is incorrect ` });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res
      .status(401)
      .json({ message: `KNY-sw: Email or password is incorrect ` });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res
      .status(401)
      .json({ message: `SS-eng: Email or password is incorrect ` });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res.status(401).json({ message: `SS-sw: Email or password is incorrect ` });
  } else {
    res.status(401);
    throw new Error("KSW: something goes wrong");
  }
};
