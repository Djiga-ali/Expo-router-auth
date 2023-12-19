// Nodemailer-express-handlebars is a useful plugin for Nodemailer that allows you to use Handlebars templates in your HTML emails | Link.
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const sendEmail = async (
  subject,
  send_to,
  sent_from,
  reply_to,
  template,
  content,
  name,
  link
) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    // tls : permet d'eviter que le mail ne soit pas envoyé à cause de contrôle de sécurité http ou https
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Options for sending email (this nodemailer-express-handlebars options)
  const handlearOptions = {
    //
    viewEngine: {
      // extName the extension of the views to use (defaults to .handlebars)
      extName: ".handlebars",
      //    partials directory is relative to express settings.view + partials/ The string path to the directory where the partials templates reside
      //   ici, on indique le repertoire où se trouse le templade de email
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    // viewPath (required) provides the path to the directory where your views are
    viewPath: path.resolve("./views"),
    // extName : The normalized extname which will always start with . and defaults to .handlebars.
    extName: ".handlebars",
  };
  // An object cache which holds compiled Handlebars template functions in the format: {"path/to/template": [Function]}.
  transporter.use("compile", hbs(handlearOptions));

  // Options for sending email (this nodemail options)
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject,
    template,
    // ici, le "context" va nous permettre de créer des éléments unique pour chaque user en utilisant "nodemailer-express-handlebars"
    context: {
      name,
      content,
      link,
    },
  };

  // Send Email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = sendEmail;
