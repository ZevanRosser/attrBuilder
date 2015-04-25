(function() {
  var AttrBuilder = function() {};
  
  _.extend(AttrBuilder.prototype, {
    
    clear: function() {
      this.cmds = [];
      this.currentUnits = '';
    },
    
    setUnits: function(val) {
      this.currentUnits = val;
      return this;
    },
    
    unsetUnits: function() {
      this.currentUnits = '';
      return this;
    },
    
    units: function(val) {
      this.cmds[this.cmds.length - 1].units = val;
      return this;
    },
    
    func: function() {
      var values = _(arguments).toArray().rest().flatten().value();
      this.cmds.push({
        type: 'function',
        name: arguments[0],
        values: values,
        units: this.currentUnits
      });
      return this;
    },
    
    add: function() {
      var args = _(arguments).toArray().value();
      this.cmds.push({
        type: 'value',
        values: args,
        units: this.currentUnits
      });
      return this;
    },
    
    val: function() {
      var cmds = [], values;
      
      this.cmds.forEach(function(cmd) {
        
        if (cmd.type === 'function' &&
            _.indexOf(cmd.values, undefined) === -1) {
          
          values = cmd.values.join(cmd.units + ', ') + cmd.units;
          cmds.push([ cmd.name, '(', values, ')' ].join(''));
        } else {
          values = cmd.values.join(cmd.units + ' ') + cmd.units;
          cmds.push(values); 
        }
        
      });
      
      return cmds.join(' ');
    }
    
  });
  
  // if needed support for things like `rotateX` 
  // `rgb`, `rgba` `hsl` etc... could be added here
  [ 'rotate', 'translate', 'scale', 'rgba', 'rgb', 'hsl', 'hsla' ]
    .forEach(function(name) {
      AttrBuilder.prototype[name] = _.partial(AttrBuilder.prototype.func, name);
    });
  
  // if needed suppport for others
  [  'deg', 'px', 'pt' ].forEach(function(name) {
    AttrBuilder.prototype[name] = _.partial(AttrBuilder.prototype.units, name);
  });
  
  window.attr = function() {
    var builder = attr.builder || (attr.builder = new AttrBuilder());
    builder.clear();
    // we have arguments so default to using the `AttrBuilder.add` function
    // and return `val()` (this is good for complex class definitions)
    if (arguments.length > 0) {
      return builder.add.apply(builder, arguments).val();
    }
    return builder;
  };
  
})();