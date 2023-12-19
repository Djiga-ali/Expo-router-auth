exports.passwordErrorMsg = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res
      .status(400)
      .json({ message: `BDI: oldPassword and newPassword are required ` });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `BDI-sw: oldPassword and newPassword are required ` });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res
      .status(400)
      .json({ message: `BDI-fr: oldPassword and newPassword are required ` });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res
      .status(400)
      .json({ message: `RWD: oldPassword and newPassword are required ` });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `RWD-sw: oldPassword and newPassword are required ` });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res
      .status(400)
      .json({ message: `RWD-eng: oldPassword and newPassword are required ` });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res
      .status(400)
      .json({ message: `RDC-Lngl: oldPassword and newPassword are required ` });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `RDC-sw: oldPassword and newPassword are required ` });
  } else if (user.country === "RDC" && user.language === "Français") {
    res
      .status(400)
      .json({ message: `RDC-fr: oldPassword and newPassword are required ` });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res
      .status(400)
      .json({ message: `TZ-eng: oldPassword and newPassword are required ` });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `TZ-sw: oldPassword and newPassword are required ` });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res
      .status(400)
      .json({ message: `UD-lga: oldPassword and newPassword are required ` });
  } else if (user.country === "Uganda" && user.language === "English") {
    res
      .status(400)
      .json({ message: `UD-eng: oldPassword and newPassword are required ` });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `UD-sw: oldPassword and newPassword are required ` });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res
      .status(400)
      .json({ message: `KNY-eng: oldPassword and newPassword are required ` });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `KNY-sw: oldPassword and newPassword are required ` });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res
      .status(400)
      .json({ message: `SS-eng: oldPassword and newPassword are required ` });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res
      .status(400)
      .json({ message: `SS-sw: oldPassword and newPassword are required ` });
  } else {
    res.status(400);
    throw new Error("KSW: something goes wrong");
  }
};

exports.samePasswordErrorMsg = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res.status(400).json({
      message: `BDI: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `BDI-sw: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res.status(400).json({
      message: `BDI-fr: Please you've already use this password please choose new password `,
    });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res.status(400).json({
      message: `RWD: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `RWD-sw: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res.status(400).json({
      message: `RWD-eng: Please you've already use this password please choose new password `,
    });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res.status(400).json({
      message: `RDC-Lngl: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `RDC-sw: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "RDC" && user.language === "Français") {
    res.status(400).json({
      message: `RDC-fr: Please you've already use this password please choose new password `,
    });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res.status(400).json({
      message: `TZ-eng: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `TZ-sw: Please you've already use this password please choose new password `,
    });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res.status(400).json({
      message: `UD-lga: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Uganda" && user.language === "English") {
    res.status(400).json({
      message: `UD-eng: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `UD-sw: Please you've already use this password please choose new password `,
    });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res.status(400).json({
      message: `KNY-eng: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `KNY-sw: Please you've already use this password please choose new password `,
    });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res.status(400).json({
      message: `SS-eng: Please you've already use this password please choose new password `,
    });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res.status(400).json({
      message: `SS-sw: Please you've already use this password please choose new password `,
    });
  } else {
    res.status(400);
    throw new Error("KSW: something goes wrong");
  }
};

exports.noMatchPasswordErrorMsg = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res.status(401).json({ message: `BDI: Old password is incorrect ` });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res.status(401).json({ message: `BDI-sw: Old password is incorrect ` });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res.status(401).json({ message: `BDI-fr: Old password is incorrect ` });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res.status(401).json({ message: `RWD: Old password is incorrect ` });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res.status(401).json({ message: `RWD-sw: Old password is incorrect ` });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res.status(401).json({ message: `RWD-eng: Old password is incorrect ` });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res.status(401).json({ message: `RDC-Lngl: Old password is incorrect ` });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res.status(401).json({ message: `RDC-sw: Old password is incorrect ` });
  } else if (user.country === "RDC" && user.language === "Français") {
    res.status(401).json({ message: `RDC-fr: Old password is incorrect ` });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res.status(401).json({ message: `TZ-eng: Old password is incorrect ` });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res.status(401).json({ message: `TZ-sw: Old password is incorrect ` });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res.status(401).json({ message: `UD-lga: Old password is incorrect ` });
  } else if (user.country === "Uganda" && user.language === "English") {
    res.status(401).json({ message: `UD-eng: Old password is incorrect ` });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res.status(401).json({ message: `UD-sw: Old password is incorrect ` });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res.status(401).json({ message: `KNY-eng: Old password is incorrect ` });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res.status(401).json({ message: `KNY-sw: Old password is incorrect ` });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res.status(401).json({ message: `SS-eng: Old password is incorrect ` });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res.status(401).json({ message: `SS-sw: Old password is incorrect ` });
  } else {
    res.status(401);
    throw new Error("KSW: something goes wrong");
  }
};
