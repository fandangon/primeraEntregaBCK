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
  res.header("Content-Type", "application/json; charset=UTF8");
  cartData.getAll().then((cart) => res.json(cart));
});

//TRAER UN CARRO POR ID
cartsRoute.get("/:id/products", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  const id = req.params.id;
  cartData.getById(id).then((products) => res.json(products));
});

//CREAR NUEVO CARRITO
cartsRoute.post("/", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  cartData.saveCarrito().then((products) => res.json(products));
});

//AGREGAR PRODUCTOS AL CARRITO POR ID
cartsRoute.post("/:idCarro/products/:id", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  const idCarro = req.params.idCarro;
  productsData.getById(req.params.id).then((product) => {
    if (product == undefined) return res.status(404).send();

    cartData.saveProductsCarrito(product, idCarro).then((r1) => {
      cartData.getById(idCarro).then((product) => res.json(product));
    });
  });
});

//ELIMINAR CARRITO POR ID Y DEVUELVE LOS CARRITOS RESTANTES
cartsRoute.delete("/:id", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  cartData.deleteById(req.params.id).then((products) => res.json(products));
});

//Elimina un producto indicado de un carro indicado
cartsRoute.delete("/:idCarro/products/:id", isAdmin, (req, res) => {
  cartData
    .eliminarProdDeCarro(req.params.idCarro, req.params.id)
    .then((products) => res.json(products));
});

module.exports = cartsRoute;
