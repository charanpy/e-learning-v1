const { deleteFiles, deleteFile } = require('./s3');

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next)
      .catch(async (e) => {
        if (
          req?.body?.image?.key ||
          req?.body?.file?.key ||
          req?.body?.video?.key
        )
          await deleteFile(
            req.body?.image?.key ||
              req?.body?.file?.key ||
              req?.body?.video?.key
          );
        next(e);
      })
      .finally(async () => {
        if (req.file) await deleteFiles();
      });
  };
};
