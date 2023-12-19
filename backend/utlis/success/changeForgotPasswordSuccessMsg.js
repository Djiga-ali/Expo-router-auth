exports.changeForgotPasswordSuccessMsg = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res
      .status(201)
      .json({ message: `BDI: Password change successful, please re-login` });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `BDI-sw: Password change successful, please re-login` });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res
      .status(201)
      .json({ message: `BDI-fr: Password change successful, please re-login` });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res
      .status(201)
      .json({ message: `RWD: Password change successful, please re-login` });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `RWD-sw: Password change successful, please re-login` });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res.status(201).json({
      message: `RWD-eng: Password change successful, please re-login`,
    });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res.status(201).json({
      message: `RDC-Lngl: Password change successful, please re-login`,
    });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `RDC-sw: Password change successful, please re-login` });
  } else if (user.country === "RDC" && user.language === "Français") {
    res
      .status(201)
      .json({ message: `RDC-fr: Password change successful, please re-login` });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res
      .status(201)
      .json({ message: `TZ-eng: Password change successful, please re-login` });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `TZ-sw: Password change successful, please re-login` });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res
      .status(201)
      .json({ message: `UD-lga: Password change successful, please re-login` });
  } else if (user.country === "Uganda" && user.language === "English") {
    res
      .status(201)
      .json({ message: `UD-eng: Password change successful, please re-login` });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `UD-sw: Password change successful, please re-login` });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res.status(201).json({
      message: `KNY-eng: Password change successful, please re-login`,
    });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `KNY-sw: Password change successful, please re-login` });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res
      .status(201)
      .json({ message: `SS-eng: Password change successful, please re-login` });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `SS-sw: Password change successful, please re-login` });
  } else {
    res.status(400);
    throw new Error("KSW: something goes wrong");
  }
};
