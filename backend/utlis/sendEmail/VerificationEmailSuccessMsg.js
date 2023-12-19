exports.sentEmailSuccessMessage = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res.status(200).json({
      message: "BDI: We send you an email. Please check your email",
    });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `BDI-sw: We send you an email. Please check your email`,
    });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res.status(200).json({
      message: `BDI-fr: We send you an email. Please check your email`,
    });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res.status(200).json({
      message: `RWD: We send you an email. Please check your email`,
    });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `RWD-sw: We send you an email. Please check your email`,
    });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res.status(200).json({
      message: `RWD-eng: We send you an email. Please check your email`,
    });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res.status(200).json({
      message: `RDC-Lngl: We send you an email. Please check your email`,
    });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `RDC-sw: We send you an email. Please check your email`,
    });
  } else if (user.country === "RDC" && user.language === "Français") {
    res.status(200).json({
      message: `RDC-fr: We send you an email. Please check your email`,
    });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res.status(200).json({
      message: `TZ-eng: We send you an email. Please check your email`,
    });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `TZ-sw: We send you an email. Please check your email`,
    });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res.status(200).json({
      message: `UD-lga: We send you an email. Please check your email`,
    });
  } else if (user.country === "Uganda" && user.language === "English") {
    res.status(200).json({
      message: `UD-eng: We send you an email. Please check your email`,
    });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `UD-sw: We send you an email. Please check your email`,
    });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res.status(200).json({
      message: `KNY-eng: We send you an email. Please check your email`,
    });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `KNY-sw: We send you an email. Please check your email`,
    });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res.status(200).json({
      message: `SS-eng: We send you an email. Please check your email`,
    });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res.status(200).json({
      message: `SS-sw: We send you an email. Please check your email`,
    });
  } else {
    res.status(400);
    throw new Error("KSW: something goes wrong");
  }
};
