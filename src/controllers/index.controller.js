import { pool } from "../database.js";

export const renderIndex = (req, res) => res.render("index");

export const renderProduct = async (req, res) => {
    const [proRows] = await pool.query(" SELECT * FROM PRODUCT WHERE 1 = 1  AND SHOP = 1  AND STARTSAT < NOW() ");
    const [cateRows] = await pool.query(" SELECT * FROM CATEGORY WHERE isUse = 'Y' ");
    res.render("index", { productList: proRows, categoryList: cateRows });
};

export const ping = async (req, res) => {
    const [result] = await pool.query('SELECT 1 + 1 AS result')
    res.json(result[0])
}