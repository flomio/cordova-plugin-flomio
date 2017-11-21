const xcode = require('xcode')
const fs = require('fs')

module.exports = function(ctx) {
  if (ctx.opts.platforms.indexOf('ios') < 0) {
    return
  }
  const deferral = ctx.requireCordovaModule('q').defer()
  const common = ctx.requireCordovaModule('cordova-common')
  const util = ctx.requireCordovaModule('cordova-lib/src/cordova/util')

  const projectName = new common.ConfigParser(util.projectConfig(util.isCordova())).name()
  const projectPath = './platforms/ios/' + projectName + '.xcodeproj/project.pbxproj'
  const project = xcode.project(projectPath)
  const projectRoot = ctx.opts.projectRoot
  project.parse(function(err) {
    if (err) {
      console.error(err)
      deferral.reject('xcode could not parse project')
    } else{
      project.addFramework('libSDKClassesPro.a')
      project.addToLibrarySearchPaths(projectRoot + '/resources/')
      fs.writeFileSync(projectPath, project.writeSync())
      deferral.resolve()
    }
  })

  return deferral.promise
}
