const database = require("./database");

// Express 02
/*const getUsers = (req, res) => {
    database
    .query("select * from users")
    .then(([users]) => {
        res.json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
};*/

//Express 06
const getUsers = (req, res) => {
  let initialSql = "select id, firstname, lastname, email, city, language from users";
  const sqlValues = [];

  if (req.query.language != null) {
    sqlValues.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    sqlValues.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  database
  .query(
    sqlValues.reduce(
      (sql, { column, operator }, index) =>
        `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
      initialSql
    ),
    sqlValues.map(({ value }) => value)
  )
    .then(([users]) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("select id, firstname, lastname, email, city, language from users where id = ?", [id])
      .then(([users]) => {
        if ([users] != null) {
          res.json([users]).sendStatus(200);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  //Express 08
  const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body;
  
    database
      .query("select * from users where email = ?", [email])
      .then(([users]) => {
        if (users[0] != null) {
          req.user = users[0];
  
          next();
        } else {
          res.sendStatus(401);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  //Express 03
  const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    database
        .query(
            "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
            [firstname, lastname, email, city, language, hashedPassword]
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
          } else if (id !== req.payload.sub) {
            res.statut(403).send("Forbidden")
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
      } else if (id !== req.payload.sub) {
        res.statut(403).send("Forbidden")
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error delete the user");
  });
}

module.exports = {
    getUsers,
    getUsersById,
    getUserByEmailWithPasswordAndPassToNext,
    postUsers,
    putUsers,
    deleteUser,
};