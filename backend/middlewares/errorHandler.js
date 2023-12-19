exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  // ici on retourne  le code de l'erreur
  res.status(statusCode);

  // ici on retourne  le message d'erreur
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
    isError: true,
  });
};

exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
