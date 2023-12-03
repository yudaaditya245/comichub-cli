import { Comics } from "./sequelize/models.js";
import { Scraps } from "./sequelize/models.js";

Comics.findAll({
  limit: 5,
  include: [{ model: Scraps, as: 'number3' }]
}).then((d) => {
  console.log(d);
});
