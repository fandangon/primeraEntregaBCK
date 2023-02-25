const express = require("express");
const { Router } = express;
const productsRoute = Router();

// Acceso a datos - data access
const contenedor = require("../archivos");
const productsData = new contenedor("./src/data/productsData.json");

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
productsRoute.get("/", (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  productsData.getAll().then((products) => {
    res.json(products);
  });
});

//TRAER UN PRODUCTO POR ID
productsRoute.get("/:idProduct", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  const id = req.params.idProduct;
  productsData.getById(id).then((products) => res.json(products));
});

//GUARDAR NUEVO PRODUCTO
productsRoute.post("/", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");

  const body = req.body;
  
  if (body.title == undefined
    || body.thumbnail == undefined
    || body.price == undefined
    || (body.price != undefined
      && body.price == '0')
    || body.stock == undefined
    || (body.stock != undefined
      && body.stock == '0')
    || body.status == undefined
    || body.category == undefined)
    return res.status(400).send();

  productsData.save(req.body).then(() => {
    productsData.getAll().then((products) => res.json(products));
  });
});

//ACTUALIZAR PRODUCTO MEDIANTE ID
productsRoute.put("/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  productsData.getById(id).then((product) => {
    if (product == undefined) return res.status(404).send();

    productsData.updateProduct(id, req.body).then((r1) => {
      productsData.getById(id).then((product) => res.json(product));
    });
  });
});

//ELIMINAR PRODUCTO POR ID
productsRoute.delete("/:idProductos", isAdmin, (req, res) => {
  res.header("Content-Type", "application/json; charset=UTF8");
  productsData
    .deleteById(req.params.idProductos)

    .then((products) => res.json(products));
});

module.exports = productsRoute;
