module.exports = function(schema, options) {
  schema.add({ctime: {type: Date}});
  schema.add({mtime: {type: Date}});

  schema.pre('save', function(next) {
    if (this.isNew & !this.ctime) {
      this.ctime = new Date();
    }
    this.mtime = new Date()
    next();
  });

  // Update the mtime on update.
  var updateHandler = function() {
    this.update({}, {$set: {mtime: new Date()}});
  };

  schema.pre('update', updateHandler);
  schema.pre('findOneAndUpdate', updateHandler);
};