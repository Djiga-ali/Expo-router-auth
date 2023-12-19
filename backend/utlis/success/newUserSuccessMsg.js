exports.successMessage = (req, res, user) => {
  //   // Burundi *****************

  if (user.country === "Burundi" && user.language === "Ikirundi") {
    res
      .status(201)
      .json({ message: `BDI: New user ${user.first_name} created` });
  } else if (user.country === "Burundi" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `BDI-sw: New user ${user.first_name} created` });
  } else if (user.country === "Burundi" && user.language === "Français") {
    res
      .status(201)
      .json({ message: `BDI-fr: New user ${user.first_name} created` });
    // Rwanda *****************
  } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
    res
      .status(201)
      .json({ message: `RWD: New user ${user.first_name} created` });
  } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `RWD-sw: New user ${user.first_name} created` });
  } else if (user.country === "Rwanda" && user.language === "English") {
    res
      .status(201)
      .json({ message: `RWD-eng: New user ${user.first_name} created` });
    // RDC *******************************
  } else if (user.country === "RDC" && user.language === "Lingala") {
    res
      .status(201)
      .json({ message: `RDC-Lngl: New user ${user.first_name} created` });
  } else if (user.country === "RDC" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `RDC-sw: New user ${user.first_name} created` });
  } else if (user.country === "RDC" && user.language === "Français") {
    res
      .status(201)
      .json({ message: `RDC-fr: New user ${user.first_name} created` });
    //   Tanzania *****************************************************
  } else if (user.country === "Tanzania" && user.language === "English") {
    res
      .status(201)
      .json({ message: `TZ-eng: New user ${user.first_name} created` });
  } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `TZ-sw: New user ${user.first_name} created` });
    // Uganda *************************************
  } else if (user.country === "Uganda" && user.language === "Luganda") {
    res
      .status(201)
      .json({ message: `UD-lga: New user ${user.first_name} created` });
  } else if (user.country === "Uganda" && user.language === "English") {
    res
      .status(201)
      .json({ message: `UD-eng: New user ${user.first_name} created` });
  } else if (user.country === "Uganda" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `UD-sw: New user ${user.first_name} created` });
    // Kenya ********************************************
  } else if (user.country === "Kenya" && user.language === "English") {
    res
      .status(201)
      .json({ message: `KNY-eng: New user ${user.first_name} created` });
  } else if (user.country === "Kenya" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `KNY-sw: New user ${user.first_name} created` });
    //   South Sudan
  } else if (user.country === "South Sudan" && user.language === "English") {
    res
      .status(201)
      .json({ message: `SS-eng: New user ${user.first_name} created` });
  } else if (user.country === "South Sudan" && user.language === "Kiswahili") {
    res
      .status(201)
      .json({ message: `SS-sw: New user ${user.first_name} created` });
  } else {
    res.status(400);
    throw new Error("KSW: something goes wrong");
  }
};
