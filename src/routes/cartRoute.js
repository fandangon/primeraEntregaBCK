const express = require("express");
const { Router } = express;
const cartsRoute = Router();

// Acceso a datos - data access
const contenedor = require("../archivos");
const productsData = new contenedor("./src/data/productsData.json");
const cartData = new contenedor("./src/data/cartData.json");

// Autorización - authorization
const isAdmin = (req, res, next) => {
  if (true) {
    return next();
  } else {
    const response = {
      error: -1,
      description: `Ruta ${req.path} y método ${req.method} no autorizados`,
    };
    res.status(401).json(response);
  }
};


//TRAER TODOS LOS PRODUCTOS CON METODO GET
cartsRoute.get("/", (req, res) => {
    res.header('Content-Type', 'application/json; charset=UTF8')
    cartData.getAll()
        .then((cart) => res.json(cart))
})



//CREAR NUEVO CARRITO
cartsRoute.post("/", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  cartData.saveCarrito().then((products) => res.json(products));
});

//TRAER UN CARRO POR ID
cartsRoute.get("/:id", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  const id = req.params.id;
  cartData.getById(id).then((products) => res.json(products));
});

//ELIMINAR CARRITO POR ID
cartsRoute.delete("/:id", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  cartData
    .deleteById(req.params.id)

    .then((products) => res.json(products));
});

//GRABAR CARRITO POR ID
cartsRoute.post("/:idCarro/:id", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  const idCarro = req.params.idCarro;
  productsData.getById(req.params.id).then((products) =>
  cartData.saveProductsCarrito(products, idCarro)
  );
});

//TRAER PRODUCTOS DE UN CARRO POR ID
cartsRoute.get("/:idCarro/", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  const idCarro = req.params.idCarro;
  cartData.getAll(req.params.idCarro).then((products) => res.json(products));
});

//Elimina un producto indicado de un carro indicado
cartsRoute.delete("/:idCarro/:id", isAdmin, (req, res) => {
  cartData
    .eliminarProdDeCarro(req.params.idCarro, req.params.id)
    .then((products) => res.json(products));
});

module.exports = cartsRoute;