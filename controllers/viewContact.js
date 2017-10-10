//Funcion que obtiene un contacto en específico y lo despliega en la vista
function getContact(id){
    Ext.Ajax.request({
        url: 'http://atilab.esy.es/api-alegra/public/client/'+id,
        method: 'GET',
        disableCaching: false,
        useDefaultXhrHeader: false,
        success: function(conn, response, options, eOpts) {
           var data = Ext.decode(conn.responseText);
           $("title").text(data.name);
           $("#title").text(data.name);
           $("#name").text(data.name);
           $("#identification").text(data.identification);
           $("#phonePrimary").text(data.phonePrimary);
           $("#phoneSecondary").text(data.phoneSecondary);
           $("#mobile").text(data.mobile);
           $("#address").text(data.address.address);
           $("#city").text(data.address.city);
           $("#email").text(data.email);
           $("#observations").text(data.observations);
        },
        failure: function(conn, response, options, eOpts) {
        }
    });
}

Ext.onReady(function() {
  //Se obtiene el id desde la url
  var url = document.location.href.split("?");
  var id = url[1];

  //Se busca el contacto con cierto id
  getContact(id);
}); 

  