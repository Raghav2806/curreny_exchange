import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const API_URL = "https://v6.exchangerate-api.com/v6/";
const yourAPIKey = "b7a675a9959e7ba455500004";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    try {
        const response = await axios.get(API_URL + yourAPIKey + "/pair/EUR/USD");
        const result = response.data;
        res.render("index.ejs", {
            primary: result.base_code,
            secondary: result.target_code,
            convert: result.conversion_rate.toFixed(3),
            initial_prin: 100,
            final_prin: (100*(result.conversion_rate)).toFixed(3),
        });
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
  });

app.post("/", async(req, res) => {
    const first = req.body.base;
    const second = req.body.target;
    const prin = req.body.amount;
    try {
        const response = await axios.get(API_URL + yourAPIKey + `/pair/${first}/${second}/${prin}`);
        const result = response.data;
        res.render("index.ejs", {
            primary: result.base_code,
            secondary: result.target_code,
            convert: result.conversion_rate.toFixed(3),
            initial_prin: prin,
            final_prin: (result.conversion_result).toFixed(3),
        });
      } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
      }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });