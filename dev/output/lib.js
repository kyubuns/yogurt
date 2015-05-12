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
