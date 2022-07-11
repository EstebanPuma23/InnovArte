const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, 'img-product-' + Date.now() + path.extname(file.originalname))
    }
  })

  const fileFilter = function(req, file,callback) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)){
        req.fileValidationError = "Solo se permite imágenes con extensión jpg, jpeg, png, gif, webp";
        return callback(null,false,req.fileValidationError);
    }
    callback(null,true);
}
  
var upload = multer({ storage: storage, fileFilter })

module.exports = upload