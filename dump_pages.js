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
var pages = db.newPage.find({applicationId: "69f23d0ae8d23e3922706103"}).toArray();
pages.forEach(function(p) {
  var name = (p.unpublishedPage && p.unpublishedPage.name) ? p.unpublishedPage.name : String(p._id);
  print("PAGE:" + name + ":" + JSON.stringify(p, toStr, 2));
});
