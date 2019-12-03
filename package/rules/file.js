const { join } = require('path')
const { source_path: sourcePath, static_assets_extensions: fileExtensions } = require('../config')

const fs = require('fs')
const isSymLink = fs.lstatSync(sourcePath.split('/').shift()).isSymbolicLink()
const realPath = fs.realpathSync(sourcePath.split('/').shift()) + sourcePath.replace(sourcePath.split('/').shift(), '')

module.exports = {
  test: new RegExp(`(${fileExtensions.join('|')})$`, 'i'),
  use: [
    {
      loader: 'file-loader',
      options: {
        name(file) {
          if(isSymLink){
              return 'media' + file.replace(realPath, '').split('.')[0] + '-[hash].[ext]'
          }
          if (file.includes(sourcePath)) {
            return 'media/[path][name]-[hash].[ext]'
          }
          return 'media/[folder]/[name]-[hash:8].[ext]'
        },
        context: join(sourcePath)
      }
    }
  ]
}
