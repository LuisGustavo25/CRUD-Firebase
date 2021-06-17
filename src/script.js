      //Firebase configuration
      var firebaseConfig = {

        apiKey: "AIzaSyBW2wF3GBno7BE_hLJOPV6FwWYue9FVyTI",
        authDomain: "crud-5b519.firebaseapp.com",
        projectId: "crud-5b519",
        storageBucket: "crud-5b519.appspot.com",
        messagingSenderId: "786561748435",
        appId: "1:786561748435:web:96666c1b743d95a10ab326"

      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      
      const db = firebase.database();
      
      coleccionProductos = db.ref().child('productos');
      bodyProductos = $('#bodyProductos').val();
      //console.log(coleccionProductos);
      //console.log(bodyProductos);

      //Conection:
     //console.log(bodyProductos);  
  $('form').submit(function(e){

    e.preventDefault();

    let id = $('#id').val();
    let codigo = $('#codigo').val();
    let descripcion = $('#descripcion').val();
    let cantidad = $('#cantidad').val();
    let idFirebase = id;

    if(idFirebase == ''){
     idFirebase = coleccionProductos.push().key;
    };

    data = {codigo:codigo, descripcion: descripcion, cantidad: cantidad};
    actualizacionData = {};
    actualizacionData[`/${idFirebase}`] = data;
    coleccionProductos.update(actualizacionData);
    id = '';
    $('form').trigger('reset');
    $('#modalAltaEdicion').modal('hide');

  });

  const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
  const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

  function mostrarProductos({codigo, descripcion, cantidad}){

    return `
    <td>${codigo}</td>
    <td>${descripcion}</td>
    <td>${cantidad}</td>
    <td><button class="btnEditar btn btn-secondary" data-toggle="tooltip" title="Editar">${iconoEditar}</button><button class="btnBorrar btn btn-danger" data-toggle="tooltip" title="Borrar">${iconoBorrar}</button></td>
    `

  };

  //Added
  coleccionProductos.on('child_added', data =>{

    let tr = document.createElement('tr');

    tr.id = data.key;
    tr.innerHTML = mostrarProductos(data.val());
    document.getElementById('bodyProductos').appendChild(tr);

  });

  //Changed
  coleccionProductos.on('child_changed', data =>{

    let nodoEditado = document.getElementById(data.key);
    nodoEditado.innerHTML = mostrarProductos(data.val());

  });

  //Removed
  coleccionProductos.on('child_removed', data =>{

    let nodoEditado = document.getElementById(data.key);
    document.getElementById('bodyProductos').removeChild(nodoEditado);

  });

  //Buttons
  $('#btnNuevo').click(function(){

    $('#id').val('');
    $('#codigo').val('');
    $('#descripcion').val('');
    $('#cantidad').val('');
    $('form').trigger('reset');
    $('#modalAltaEdicion').modal('show');

  });

  $('#tablaProductos').on('click', '.btnEditar', function(){

    let id = $(this).closest('tr').attr('id');
    let codigo = $(this).closest('tr').find('td:eq(0)').text();
    let descripcion = $(this).closest('tr').find('td:eq(1)').text();
    let cantidad = $(this).closest('tr').find('td:eq(2)').text();

    $('#id').val(id);
    $('#codigo').val(codigo);
    $('#descripcion').val(descripcion);                
    $('#cantidad').val(cantidad);                
    $('#modalAltaEdicion').modal('show');

  });
  
  $('#tablaProductos').on('click', '.btnBorrar', function(){

      Swal.fire({
        title: '¿Está seguro de eliminar el producto?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
        
        }).then((result) => {

        if (result.value) {
            //Take the Element`s ID
            let id = $(this).closest('tr').attr('id'); 
            //Delete the Element on Firebase
            db.ref(`productos/${id}`).remove()  
            Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.','success')
        }

        })        

  });
