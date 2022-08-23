const database = require("./database");

// Express 02
const getUsers = (req, res) => {
    database
    .query("select * from users")
    .then(([users]) => {
        res.json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.json(users[0]).status(200);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  //Express 03
  const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language]
        )
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`);
            res.sendStatus(201);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
}

//Express 04
const putUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  const id = parseInt(req.params.id);

  database
      .query(
          "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
          [firstname, lastname, email, city, language, id]
      )
      .then(([result]) => {
          if (result.affectedRows === 0) {
            res.status(404).send("Not Found");
          } else {
            res.sendStatus(204);
          }
        })
      .catch((err) => {
          console.error(err);
          res.status(500).send("Error update the user");
      });
}

//Express 05

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error delete the movie");
  });
}

module.exports = {
    getUsers,
    getUsersById,
    postUsers,
    putUsers,
    deleteUser,
};