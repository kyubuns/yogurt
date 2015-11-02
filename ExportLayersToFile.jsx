// 設定

enableTrim = true // トリミングするかどうか
outputInvisibleLayer = false // 非表示のレイヤーも書き出し
format = SaveDocumentType.PNG // 保存形式
fileName = "{layer_name}.png" // 保存名
// fileName = "{index}.png" // 01, 02, 03, ...という名前で出力されるようになる



function getLastSnapshotID(doc) {
  var hsObj = doc.historyStates;
  var hsLength = hsObj.length;
  for (var i = hsLength-1; i > -1; i--) {
    if(hsObj[i].snapshot) {
      return i;
    }
  }
}

function takeSnapshot(doc) {
  var desc153 = new ActionDescriptor();
  var ref119 = new ActionReference();
  ref119.putClass(charIDToTypeID("SnpS")); // Snapshot
  desc153.putReference(charIDToTypeID("null"), ref119 );
  var ref120 = new ActionReference();
  ref120.putProperty(charIDToTypeID("HstS"), charIDToTypeID("CrnH") ); // Historystate, CurrentHistorystate
  desc153.putReference(charIDToTypeID("From"), ref120 ); // From Current Historystate
  executeAction(charIDToTypeID("Mk  "), desc153, DialogModes.NO );
  return getLastSnapshotID(doc);
}

function revertToSnapshot(doc, snapshotID) {
  doc.activeHistoryState = doc.historyStates[snapshotID];
}
// Generated by CoffeeScript 1.9.1
(function() {
  var allLayer, folder, main, outputLayer, setup;

  folder = null;

  setup = function() {
    preferences.rulerUnits = Units.PIXELS;
    if (app.documents.length === 0) {
      alert('cannot access document');
      return false;
    }
    folder = Folder.selectDialog("保存先フォルダの選択");
    if (folder === null) {
      return false;
    }
    return true;
  };

  allLayer = function(root) {
    var i, layer, len, list, ref, set;
    list = (function() {
      var i, len, ref, results;
      ref = root.artLayers;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        layer = ref[i];
        if (!(layer.visible || outputInvisibleLayer)) {
          continue;
        }
        layer.visible = false;
        results.push(layer);
      }
      return results;
    })();
    ref = root.layerSets;
    for (i = 0, len = ref.length; i < len; i++) {
      set = ref[i];
      if (set.visible) {
        list = list.concat(allLayer(set, false));
      }
    }
    return list;
  };

  main = function() {
    var copiedDoc, i, len, nameIndex, snapShotId, target, targets;
    copiedDoc = app.activeDocument.duplicate(activeDocument.name.slice(0, -4) + '.copy.psd');
    targets = allLayer(copiedDoc);
    snapShotId = takeSnapshot(copiedDoc);
    nameIndex = 1;
    for (i = 0, len = targets.length; i < len; i++) {
      target = targets[i];
      outputLayer(copiedDoc, target, nameIndex);
      nameIndex += 1;
      revertToSnapshot(copiedDoc, snapShotId);
    }
    return copiedDoc.close(SaveOptions.DONOTSAVECHANGES);
  };

  outputLayer = function(doc, layer, nameIndex) {
    var options, saveFile, tmpFileName;
    layer.visible = true;
    if (!layer.isBackgroundLayer && enableTrim) {
      doc.trim(TrimType.TRANSPARENT);
    }
    tmpFileName = fileName;
    tmpFileName = tmpFileName.replace("{layer_name}", layer.name);
    tmpFileName = tmpFileName.replace("{index}", ("0" + nameIndex).slice(-2));
    saveFile = new File(folder.fsName + "/" + tmpFileName);
    options = new ExportOptionsSaveForWeb();
    options.format = format;
    options.optimized = true;
    options.interlaced = false;
    return doc.exportDocument(saveFile, ExportType.SAVEFORWEB, options);
  };

  if (setup()) {
    main();
    alert('complete!');
  }

}).call(this);
