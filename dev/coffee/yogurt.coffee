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
  list = for layer in root.artLayers when (layer.visible or output_invisible_layer)
    layer.visible = false
    layer
  for set in root.layerSets when set.visible
    list = list.concat(allLayer(set, false))
  list

main = ->
  copiedDoc = app.activeDocument.duplicate(activeDocument.name[..-5] + '.copy.psd')
  targets = allLayer(copiedDoc)
  snapShotId = takeSnapshot(copiedDoc)
  for target in targets
    outputLayer(copiedDoc, target)
    revertToSnapshot(copiedDoc, snapShotId)
  copiedDoc.close(SaveOptions.DONOTSAVECHANGES)

outputLayer = (doc, layer) ->
  layer.visible = true
  if !layer.isBackgroundLayer and enable_trim
    doc.trim(TrimType.TRANSPARENT)

  saveFile = new File("#{folder.fsName}/#{layer.name}.png")
  pngSaveOptions = new PNGSaveOptions()
  doc.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE)

if setup()
  main()
  alert('complete!')
