//Funcion que obtiene los contactos desde la API y los almacena en el Store
function getContacts(){
  Ext.Ajax.request({
        url: 'http://atilab.esy.es/api-alegra/public/client/',
        method: 'GET',
        disableCaching: false,
        useDefaultXhrHeader: false,
        success: function(conn, response, options, eOpts) {
           var data = Ext.decode(conn.responseText);
           var newData = addActions(data); //Data con los botones de acciones (ver, editar, eliminar)
           Ext.StoreManager.lookup('jsonClients').loadData(newData);
        },
        failure: function(conn, response, options, eOpts) {
        }
    });
}

//Funcion que elimina un contacto especificado
function deleteContact(id){
    $("#dialog-confirm p").show();
    $(function() {
        $("#dialog-confirm").dialog({
          resizable: false,
          height: "auto",
          width: 400,
          modal: true,
          buttons: {
            "Si": function() {
              Ext.Ajax.request({
                url: 'http://atilab.esy.es/api-alegra/public/client/'+id,
                method: 'DELETE',
                disableCaching: false,
                useDefaultXhrHeader: false,
                success: function(conn, response, options, eOpts) {
                   var data = Ext.decode(conn.responseText);
                   getContacts();
                },
                failure: function(conn, response, options, eOpts) {
                }
              });
              $( this ).dialog( "close" );
            },
            "No": function() {
              $( this ).dialog( "close" );
            },
            "Cancelar": function() {
              $( this ).dialog( "close" );
            }
          }
        });
    });
}

//Funcion que añade los botones de acciones en el JSON para luego ser agregados en el Panel
function addActions (contactos){
  for (var i = 0; i < contactos.length; i++) {
    var id = contactos[i].id;
    contactos[i].actions = `
      <a class="icons view" href="views/viewContact.html?${id}" title="Ver"><i class="fa fa-eye" aria-hidden="true"></i></a>
      <a class="icons edit" href="views/editContact.html?${id}" title="Editar"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>
      <a class="icons delete" onclick="deleteContact(${id})" title="Eliminar"><i class="fa fa-times" aria-hidden="true"></i></a>`;
  }
  return contactos;
}

//Ext JS, donde se crea el Store el cual almacena los contactos, y se crea el panel donde se desplegan esos contactos
Ext.onReady(function() {
  //Creamos el Store
  var jsonClients = Ext.create('Ext.data.Store', {
      autoLoad: false,
      storeId: 'jsonClients',
      proxy: 'memory'
  });

  //Obtenemos los contactos y los almacenamos en el Store creado
  getContacts();

  //Se define el Panel
  Ext.define('contactsAlegra', {
      extend: 'Ext.tab.Panel',
      xtype: 'contactsAlegra',

      requires: [
          'Ext.grid.Panel',
          'Ext.toolbar.Paging',
          'Ext.grid.column.Date'
      ],

      activeTab: 0,
      margin: 20,

      items: [
          {
              xtype: 'gridpanel',
              cls: 'user-grid',
              title: 'Todos los contactos',
              routeId: 'user',
              bind: '{jsonClients}',
              scrollable: true,
              store: jsonClients,
              
              columns: [
                  {
                      xtype: 'gridcolumn',
                      width: 250,
                      dataIndex: 'name',
                      text: 'Nombre'
                  },
                  {
                      xtype: 'gridcolumn',
                      cls: 'content-column',
                      dataIndex: 'identification',
                      text: 'Identificación',
                      flex: 1
                  },
                  {
                      xtype: 'gridcolumn',
                      cls: 'content-column',
                      dataIndex: 'phonePrimary',
                      text: 'Teléfono 1',
                      flex: 1
                  },
                  {
                      xtype: 'gridcolumn',
                      cls: 'content-column',
                      width: 200,
                      dataIndex: 'observations',
                      text: 'Observaciones'
                  },
                  {
                      dataIndex: 'actions',
                      text: 'Acciones'
                      // xtype: 'actioncolumn',
                      // items: [
                          // {
                          //     xtype: 'button',
                          //     iconCls: 'fa fa-eye',
                          //     href: '/view/id/'
                          // },
                          // {
                          //     xtype: 'button',
                          //     iconCls: 'fa fa-pencil-square-o',
                          //     href: '/edit/id/'

                          // },
                          // {
                          //     xtype: 'button',
                          //     iconCls: 'fa fa-times',
                          //     title: 'Eliminar'
                          // }

                      // ],

                      // cls: 'content-column',
                      // width: 120,
                      
                      // tooltip: 'edit '
                  }
              ],
              dockedItems: [
                  {
                      store: jsonClients,
                      xtype: 'pagingtoolbar',
                      dock: 'bottom',
                      itemId: 'userPaginationToolbar',
                      displayInfo: true,
                      bind: '{jsonClients}',
                      
                  }
              ]
          }
      ]
  });

  //Creamos nuestro panel y lo desplegamos en la vista
  var list = Ext.create('contactsAlegra', {
              renderTo: Ext.getElementById('panel'),
  });  
}); 

  