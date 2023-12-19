exports.forgotPasswordMsg = (user) => {
  if (user) {
    //   //created
    //   // Burundi *****************
    if (user.country === "Burundi" && user.language === "Ikirundi") {
      return "BDI:  Please click on the link below to set a new password";
    } else if (user.country === "Burundi" && user.language === "Kiswahili") {
      return "BDI-sw:  Please click on the link below to set a new password";
    } else if (user.country === "Burundi" && user.language === "Français") {
      return "BDI-fr:  Please click on the link below to set a new password";
      // Rwanda *****************
    } else if (user.country === "Rwanda" && user.language === "Ikinyarwanda") {
      return "RWD:  Please click on the link below to set a new password";
    } else if (user.country === "Rwanda" && user.language === "Kiswahili") {
      return "RWD-sw:  Please click on the link below to set a new password";
    } else if (user.country === "Rwanda" && user.language === "English") {
      return "RWD-eng:  Please click on the link below to set a new password";
      // RDC *******************************
    } else if (user.country === "RDC" && user.language === "Lingala") {
      return "RDC-lngl:  Please click on the link below to set a new password";
    } else if (user.country === "RDC" && user.language === "Kiswahili") {
      return "RDC-sw:  Please click on the link below to set a new password";
    } else if (user.country === "RDC" && user.language === "Français") {
      return "RDC-fr:  Please click on the link below to set a new password";
      //   Tanzania *****************************************************
    } else if (user.country === "Tanzania" && user.language === "English") {
      return "TZ-eng:  Please click on the link below to set a new password";
    } else if (user.country === "Tanzania" && user.language === "Kiswahili") {
      return "Tz-sw:  Please click on the link below to set a new password";
      // Uganda *************************************
    } else if (user.country === "Uganda" && user.language === "Luganda") {
      return "UD:  Please click on the link below to set a new password";
    } else if (user.country === "Uganda" && user.language === "English") {
      return "UD-eng:  Please click on the link below to set a new password";
    } else if (user.country === "Uganda" && user.language === "Kiswahili") {
      return "UD-fr:  Please click on the link below to set a new password";
      // Kenya ********************************************
    } else if (user.country === "Kenya" && user.language === "English") {
      return "KNY-eng:  Please click on the link below to set a new password";
    } else if (user.country === "Kenya" && user.language === "Kiswahili") {
      return "KNY-sw:  Please click on the link below to set a new password";
      //   South Sudan
    } else if (user.country === "South Sudan" && user.language === "English") {
      return "SS-eng:  Please click on the link below to set a new password";
    } else if (
      user.country === "South Sudan" &&
      user.language === "Kiswahili"
    ) {
      return "SS-sw:  Please click on the link below to set a new password";
    } else {
      return "SW: Ooops something went wrong";
    }
  }
};
