outputFolder = folder

setup = ->
  preferences.rulerUnits = Units.PIXELS

  if app.documents.length == 0
    alert('cannot access document')
    return false

  if outputFolder != undefined && outputFolder != null && outputFolder != ""
    return true

  outputFolder = Folder.selectDialog("保存先フォルダの選択")
  if outputFolder == null
    return false

  outputFolder = outputFolder.fsName
  return true

allLayer = (root) ->
  list = for layer in root.layers when (layer.visible or outputInvisibleLayer)
    if layer.typename == "ArtLayer"
      layer.visible = false unless layer.name in backgroundLayerNames
      layer
    else
      allLayer(layer)

  Array.prototype.concat.apply([], list) # list.flatten()

main = ->
  documentFileName = app.activeDocument.name[..-5]
  copiedDoc = app.activeDocument.duplicate(activeDocument.name[..-5] + '.copy.psd')
  targets = allLayer(copiedDoc)
  snapShotId = takeSnapshot(copiedDoc)
  nameIndex = 1
  for target in targets
    outputLayer(copiedDoc, target, nameIndex, targets.length - nameIndex + 1, documentFileName)
    nameIndex += 1
    revertToSnapshot(copiedDoc, snapShotId)
  copiedDoc.close(SaveOptions.DONOTSAVECHANGES)

outputLayer = (doc, layer, nameIndex, rnameIndex, documentFileName) ->
  layer.visible = true
  if !layer.isBackgroundLayer and enableTrim
    doc.trim(TrimType.TRANSPARENT)

  tmpFileName = fileName
  tmpFileName = tmpFileName.replace("{layer_name}", layer.name)
  tmpFileName = tmpFileName.replace("{file_name}", documentFileName)
  tmpFileName = tmpFileName.replace("{index}", ("0" + nameIndex).slice(-2))
  tmpFileName = tmpFileName.replace("{rindex}", ("0" + rnameIndex).slice(-2))
  saveFile = new File("#{outputFolder}/#{tmpFileName}")
  doc.saveAs(saveFile, SaveDocumentType.PHOTOSHOP, true, Extension.LOWERCASE)

if setup()
  main()
  alert('complete!')
