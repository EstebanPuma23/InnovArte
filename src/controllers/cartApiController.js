const db = require('../database/models');
const getURL = req => `${req.protocol}://${req.get('host')}${req.originalUrl}`;

const productVerify = (carrito, id) => {

    
    let index = -1;
    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].id == id) {
            index = i;
            break
        }
    }
    return index
}

module.exports ={
    show: async(req,res) =>{
        /* req.session.carrito = [
            {
                "id": 2,
                "nombre": "Cuaderno AVON universitario",
                "image": "cuaderno-avon-universitario.jpg",
                "precio": 240,
                "categoria": "oficina",
                "cantidad": 1,
                "total": 240
              },
              {
                "id": 5,
                "nombre": "Pincel escolar chato N°1",
                "image": "pincel.jpg",
                "precio": 250,
                "categoria": "oficina",
                "cantidad": 1,
                "total": 250
              }
        ]; */

        let response = {
            meta: {
                link: getURL(req)
            },
            data: req.session.carrito
        }
        return res.status(200).json(response);
    },
    add: async(req,res) =>{
        try {
           /*  req.session.carrito = [
                {
                    "id": 2,
                    "nombre": "Cuaderno AVON universitario",
                    "image": "cuaderno-avon-universitario.jpg",
                    "precio": 240,
                    "categoria": "oficina",
                    "cantidad": 1,
                    "total": 240
                  }
            ];

            req.session.userLogin = {
                id: 1,
                name: "admin",
                surname: "innovarte",
                email: "admin@innovarte.com",
                profile_picture: "foto-default.jpg",
                rol: 2
            } */


            let product = await db.Product.findByPk(req.params.id, {
                include: ['Category']
            });

            
          //  return res.status(200).json(req.session.carrito)
            
            let item = {
                id: product.id,
                nombre: product.name,
                image: product.image,
                precio: +product.price,
                categoria: product.Category.name,
                cantidad: 1,
                total: +product.price,
            }
            //return res.status(200).json(item)
            //ORDER QUE HIZO EL PROFESOR
            
            if (req.session.carrito.length == 0) {

                req.session.carrito.push(item)

                /* guarda los productos en la tabla carrito */
                await db.Cart.create({
                    userId: req.session.userLogin.id,
                    productId: item.id,
                    quantity: 1
                })
            } else {

                let index = productVerify(req.session.carrito, req.params.id)

                if (index === -1) {
                  
                    req.session.carrito.push(item)

                    /* guarda los productos en la tabla carrito */
                    await db.Cart.create({
                        userId: req.session.userLogin.id,
                        productId: item.id,
                        quantity: 1
                    })

                } else {

                    let product = req.session.carrito[index];

                    product.cantidad++
                    product.total = product.cantidad * product.precio

                    req.session.carrito[index] = product

                    /* actualiza la cantidad del producto en la tabla carrito */

                    await db.Cart.update(
                        {
                            quantity: product.cantidad
                        },
                        {
                            where: {
                               
                                productId: product.id
                            }
                        }
                    )
                }
            }
//console.log(req.session.Cart);

            let response = {
                meta: {
                    link: getURL(req)
                },
                data: req.session.carrito
            }
            return res.status(200).json(response)

        } catch (error) {
            console.log(error);
        }
    },
    remove: async(req,res) =>{
        try {
           /*  req.session.carrito = [
                {
                    "id": 2,
                    "nombre": "Cuaderno AVON universitario",
                    "image": "cuaderno-avon-universitario.jpg",
                    "precio": 240,
                    "categoria": "oficina",
                    "cantidad": 1,
                    "total": 240
                  },
                  {
                    "id": 5,
                    "nombre": "Pincel escolar chato N°1",
                    "image": "pincel.jpg",
                    "precio": 250,
                    "categoria": "oficina",
                    "cantidad": 1,
                    "total": 250
                  }
            ]; */

           /*  req.session.userLogin = {
                id: 1,
                name: "admin",
                surname: "innovarte",
                email: "admin@innovarte.com",
                profile_picture: "foto-default.jpg",
                rol: 2
            } */

            let index = productVerify(req.session.carrito,req.params.id)

            let product = req.session.carrito[index]

            if(product.cantidad > 1){

                product.cantidad--
                product.total = product.cantidad * product.precio
                req.session.carrito[index] = product   

                /* disminuye la cantidad del producto seleccinado */
                await db.Cart.update(
                    {
                        quantity : product.cantidad
                    },
                    {
                        where : {
                           
                            productId : product.id
                        }
                    }
                )

            }else{
                req.session.carrito.splice(index,1);

                /* elimina el producto de la tabla carrito */
                await db.Cart.destroy({
                    where : {
                        productId : product.id,
                       
                    }
                })
            }

            let response = {
                meta: {
                    link: getURL(req)
                },
                data: req.session.carrito
            }
            return res.status(200).json(response)

        } catch (error) {
            console.log(error)
            return res.status(500).json(error)

        }
    },
    empty: async(req,res) =>{

        try {
            /* req.session.userLogin = {
                id: 1,
                name: "admin",
                surname: "innovarte",
                email: "admin@innovarte.com",
                profile_picture: "foto-default.jpg",
                rol: 2
            }

            req.session.carrito = [
                {
                    "id": 2,
                    "nombre": "Cuaderno AVON universitario",
                    "image": "cuaderno-avon-universitario.jpg",
                    "precio": 240,
                    "categoria": "oficina",
                    "cantidad": 1,
                    "total": 240
                  },
                  {
                    "id": 5,
                    "nombre": "Pincel escolar chato N°1",
                    "image": "pincel.jpg",
                    "precio": 250,
                    "categoria": "oficina",
                    "cantidad": 1,
                    "total": 250
                  }
            ]; */

            await db.Cart.destroy({
                where : { 
                    userId : req.session.userLogin.id
                }
            })

            req.session.carrito = [];
            let response = {
                meta: {
                    link: getURL(req)
                },
                data: req.session.carrito
            }
            return res.status(200).json(response)
        } catch (error) {
            console.error(error)
            return res.status(500).json(error)

        }
    }
}