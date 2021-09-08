const express = require("express");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
require("dotenv").config();
require("express-async-errors");
const router = express.Router();

(async () => {
  const dbUser = process.env.DB_USER;
  const dbPass = process.env.DB_PASS;
  const dbName = process.env.DB_NAME;
  const dbHost = process.env.DB_HOST;

  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 8080;
  const connectionString = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

  const options = {
    useUnifiedTopology: true,
  };

  const client = await mongodb.MongoClient.connect(connectionString, options);

  const db = client.db("Rick");
  const personagens = db.collection("rickrick");

  const getPersonagensValidas = () => personagens.find({}).toArray();
  const getPersonagemById = async (id) =>
    personagens.findOne({ _id: ObjectId(id) });

  router.all("/*", (req, res, next) => {
    next();
  });

  router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const personagem = await getPersonagemById(id);
    if (!personagem) {
      res
        .status(404)
        .send({ error: "O personagem especificado não foi encontrado" });
      return;
    }
    res.send(personagem);
  });
})();

module.exports = router;
