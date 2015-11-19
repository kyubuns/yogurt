folder = null

setup = ->
  preferences.rulerUnits = Units.PIXELS

  if app.documents.length == 0
    alert('cannot access document')
    return false

  folder = Folder.selectDialog("保存先フォルダの選択")
  if folder == null
    return false

  return true

allLayer = (root) ->
  list = for layer in root.layers when (layer.visible or outputInvisibleLayer)
    if layer instanceof ArtLayer
      layer.visible = false
      layer
    else
      allLayer(layer)

  Array.prototype.concat.apply([], list) # list.flatten()

main = ->
  copiedDoc = app.activeDocument.duplicate(activeDocument.name[..-5] + '.copy.psd')
  targets = allLayer(copiedDoc)
  snapShotId = takeSnapshot(copiedDoc)
  nameIndex = 1
  for target in targets
    outputLayer(copiedDoc, target, nameIndex, targets.length - nameIndex + 1)
    nameIndex += 1
    revertToSnapshot(copiedDoc, snapShotId)
  copiedDoc.close(SaveOptions.DONOTSAVECHANGES)

outputLayer = (doc, layer, nameIndex, rnameIndex) ->
  layer.visible = true
  if !layer.isBackgroundLayer and enableTrim
    doc.trim(TrimType.TRANSPARENT)

  tmpFileName = fileName
  tmpFileName = tmpFileName.replace("{layer_name}", layer.name)
  tmpFileName = tmpFileName.replace("{index}", ("0" + nameIndex).slice(-2))
  tmpFileName = tmpFileName.replace("{rindex}", ("0" + rnameIndex).slice(-2))
  saveFile = new File("#{folder.fsName}/#{tmpFileName}")
  options = new ExportOptionsSaveForWeb()
  options.format = format
  options.optimized = true
  options.interlaced = false
  doc.exportDocument(saveFile, ExportType.SAVEFORWEB, options)

if setup()
  main()
  alert('complete!')
