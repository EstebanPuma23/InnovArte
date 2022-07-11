const confirm = (id, e) => {
    e.preventDefault()
    Swal.fire({
        title: 'Estas seguro que deseas eliminar este producto?',
        text: "Este proceso es irreversible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, deseo eliminarlo'
      }).then((result) => {
        if (result.isConfirmed) {
            setTimeout(() => {
                document.getElementById(id).submit()
            }, 2000);
          Swal.fire(
            'Eliminado',
            'El producto ha sido eliminado correctamente',
            'success'
          )
        }
      })
} 