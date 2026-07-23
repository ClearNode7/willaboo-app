function toStr(k, v) {
  var oidKey = '$oid';
  var dateKey = '$date';
  var nlKey = '$numberLong';
  if (v && v[oidKey]) return v[oidKey];
  if (v && v[dateKey]) {
    var d = v[dateKey];
    return new Date(d[nlKey] ? Number(d[nlKey]) : d).toISOString();
  }
  return v;
}
function redact(obj) {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach(function(k) {
    if (/password/i.test(k) || /authentication/i.test(k)) {
      obj[k] = "***REDACTED***";
    } else if (typeof obj[k] === 'object') {
      redact(obj[k]);
    }
  });
}
var appId = "69f23d0ae8d23e3922706103";
var wsId = "69f23d0ae8d23e39227060fe";

var app = db.application.findOne({_id: ObjectId(appId)});
print("===APPLICATION_START===");
print(JSON.stringify(app, toStr, 2));
print("===APPLICATION_END===");

var pages = db.newPage.find({applicationId: appId}).toArray();
var pageIds = [];
pages.forEach(function(p) {
  pageIds.push(String(p._id));
  var name = (p.unpublishedPage && p.unpublishedPage.name) ? p.unpublishedPage.name : String(p._id);
  print("===PAGE_START:" + name + "===");
  print(JSON.stringify(p, toStr, 2));
  print("===PAGE_END===");
});

var actions = db.newAction.find({"unpublishedAction.pageId": {$in: pageIds}}).toArray();
actions.forEach(function(a) {
  var name = (a.unpublishedAction && a.unpublishedAction.name) ? a.unpublishedAction.name : String(a._id);
  print("===ACTION_START:" + name + "===");
  print(JSON.stringify(a, toStr, 2));
  print("===ACTION_END===");
});

var datasources = db.datasource.find({workspaceId: wsId}).toArray();
datasources.forEach(function(ds) {
  redact(ds);
  var name = ds.name || String(ds._id);
  print("===DATASOURCE_START:" + name + "===");
  print(JSON.stringify(ds, toStr, 2));
  print("===DATASOURCE_END===");
});

