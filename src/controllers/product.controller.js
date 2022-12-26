/*
import { pool } from "../database.js";

export const renderProductList = async (req, res) => {
    const [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE 1 = 1  AND SHOP = 1  AND STARTSAT < NOW() ");
    res.render("product/list", { productList: rows });
};

export const renderCategoryList = async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE CATEGORY = ? ORDER BY id ASC ", [id]);
    res.render("product/categoryList", { categoryList: rows });
};

export const viewProduct = async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE id = ? ", [id]);
    res.render("product/view", { product: rows });
};*/

import { pool } from "../database.js";

export const renderProductList = async (req, res) => {
    const [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE 1 = 1  AND SHOP = 1  AND STARTSAT < NOW() ");
    res.render("product/list", { productList: rows });
};

export const renderCategoryList = async (req, res) => {

    //https://github.com/lukechopper/NodeJS-EJS-Pagination 페이징처리 참고

    const { id } = req.params;
    const [totalRows] = await pool.query(" SELECT count(*) AS totRows FROM PRODUCT WHERE CATEGORY = ? ORDER BY id ASC ", [id]);

    const resultsPerPage = 10;
    const numOfResults = totalRows[0].totRows;
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);

    let page = req.query.page ? Number(req.query.page) : 1;
    if(page > numberOfPages){
        res.redirect('/?page='+encodeURIComponent(numberOfPages));
    }else if(page < 1){
        res.redirect('/?page='+encodeURIComponent('1'));
    }

    const startingLimit = (page - 1) * resultsPerPage;
    const [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE CATEGORY = ? ORDER BY id ASC LIMIT ? , ? ", [id , startingLimit , resultsPerPage ]);
    let iterator = (page - 5) < 1 ? 1 : page - 5;
    //console.log("iterator1 : " + iterator ); //1
    let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
/*    if(endingLink < (page + 4)){
        iterator -= (page + 4) - numberOfPages; //-1
        console.log("iterator2 : " + iterator );
    }*/

    res.render("product/categoryList", { cateProduct: rows ,  page, iterator, endingLink, numberOfPages, id });
};

export const viewProduct = async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE id = ? ", [id]);
    const [reviewRows] = await pool.query("" +
        " SELECT A.title, " +
        "    B.fullName, " +
        "        CASE " +
        "           WHEN A.rating >= 80 THEN 5 " +
        "           WHEN A.rating < 80 AND A.rating >= 60 THEN 4 " +
        "           WHEN A.rating < 60 AND A.rating >= 40 THEN 3 " +
        "           WHEN A.rating < 40 AND A.rating >= 20 THEN 2 " +
        "           WHEN A.rating < 20 AND A.rating >= 0 THEN 1 " +
        "       END AS rating, " +
        "    A.content, " +
        "    DATE_FORMAT(A.createdAt,'%Y-%m-%d') AS createdAt " +
        " FROM PRODUCT_REVIEW A " +
        " LEFT JOIN USER AS B ON B.ID = A.USERID " +
        " WHERE 1=1 " +
        " AND A.PRODUCTID = ? " +
        " ORDER BY CREATEDAT DESC ", [id]);
    res.render("product/view", { product: rows, reviewRows: reviewRows });
};