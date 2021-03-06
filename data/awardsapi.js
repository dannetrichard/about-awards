// this file is injected via pageMod
var baseurl;
self.port.on('data-url', function(url) {
  baseurl = url;
  var head = document.getElementsByTagName("head")[0];
  //dump("using baseurl of "+baseurl+"\n");
  var fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", baseurl+"bootstrap.min.css");
  head.appendChild(fileref);
  
  fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", baseurl+"styles.css");
  head.appendChild(fileref);
  
  //fileref=document.createElement("link");
  //fileref.setAttribute("rel", "stylesheet");
  //fileref.setAttribute("type", "text/css");
  //fileref.setAttribute("href", baseurl+"boxes.css");
  //head.appendChild(fileref);

  var fileref=document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", baseurl+"jquery-1.4.4.min.js");
  head.appendChild(fileref);

  fileref=document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", baseurl+"jquery.tmpl.min.js");
  head.appendChild(fileref);

  fileref=document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", baseurl+"awards.js");
  head.appendChild(fileref);


});

var programs, accounts;

self.port.on("programs", function(data) {
  programs = data;
  unsafeWindow.setPrograms(programs);
});

self.port.on("accounts", function(data) {
  accounts = data;
  unsafeWindow.setAccounts(programs, accounts);
  //unsafeWindow.$('.account-menu').attr('src', baseurl+'eye-toggle.png');
});

self.port.on("account-refresh", function(args) {
  var key = args.account.hostname+"#"+args.account.username;
  //console.log("got program-refresh "+key+" = "+JSON.stringify(args));
  localStorage[key] = JSON.stringify(args.data);
  // now, how to update one part of our template easily?
  unsafeWindow.setAccounts(programs, accounts);
  //unsafeWindow.$('.account-menu').attr('src', baseurl+'eye-toggle.png');
});

self.port.on("loginFailure", function(account) {
  //console.log("loginFailure for "+JSON.stringify(account));
  unsafeWindow.setLoginFailure(account);
});

unsafeWindow.awards = {
  ready: function() {
    //console.log("ready called");
    self.port.emit("ready");
  },
  refresh: function(program, visible) {
    program.visible = visible;
    self.port.emit("refresh", program);
    var img = unsafeWindow.$('div[domain="'+program.account.hostname+'"][account="'+program.account.username+'"] .favicon');
    img.attr('src', baseurl+'connecting.png');
  },
  addProgram: function(name) {
    for (var i=0; i < programs.length; i++) {
      let p = programs[i];
      if (p.name == name) {
        self.port.emit('addProgram', p);
        break;
      }
    }
  },
  console: console
};
console.log("awards api loaded");
