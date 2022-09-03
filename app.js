const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const hostname = "127.0.0.1";
const port = "3000";
const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});


app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const email = req.body.email;

  const data = {
    email: email,
    unconfirmed: true,
    values: [
      {
        parameter_id: "169407",
        value: firstName,
      },
      {
        parameter_id: "169408",
        value: lastName,
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://api.notisend.ru/v1/email/lists/307844/recipients";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer 9fe3bd60c72fd6d4192c5b13f7333ad5",
    },
  };

  // https.get(url, options, function (response) {
  //   console.log("statusCode:", res.statusCode);
  //   response.on("data", function (data) {
  //     console.log(JSON.parse(data));
  //   });
  // });

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 201) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    console.log("statusCode:", response.statusCode);
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(port, () => {
  console.log(`Server is running on https://${hostname}:${port}/`);
});

// API Key
// 9fe3bd60c72fd6d4192c5b13f7333ad5

