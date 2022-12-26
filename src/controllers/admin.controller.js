import {pool} from "../database.js";
import path from "path";
import multiparty from "multiparty";
import qs from "qs";
import {fileURLToPath} from "url";

const uploadDir = path.dirname(fileURLToPath(import.meta.url))
    .replace("\\controllers","")
    .concat("\\public\\uploads");

export const isAdmin = async (req, res, next) => {
  const id  = req.user.id;
  const [isAdmin] = await pool.query("SELECT isAdmin FROM USER WHERE ID = ?", [id]);
  if(isAdmin[0].isAdmin == '0' || isAdmin[0].isAdmin == 0){
    req.flash("message", "접근 권한이 없는 사용자입니다.");
    return res.redirect("/");
  } else {
    return next();
  }
};

export const renderAdmin = async (req, res) => {
  res.render("admin/main");
};

export const adminProduct = async (req, res) => {

  let cateId = req.body.cateId ? Number(req.body.cateId) : 'all';
  let [totalRows] = '';
  if(cateId != null && cateId != '' && cateId == 'all'){
    [totalRows] = await pool.query(" SELECT count(*) AS totRows FROM PRODUCT ORDER BY id ASC ");
  } else if (cateId != null && cateId != ''){
    [totalRows] = await pool.query(" SELECT count(*) AS totRows FROM PRODUCT WHERE CATEGORY = ? ORDER BY id ASC ", [cateId]);
  } else {
    req.flash("message", "에러발생");
    return res.redirect("/");
  }

  const [cateRows] = await pool.query(" SELECT * FROM CATEGORY WHERE isUse = 'Y' ");

  const resultsPerPage = 10;
  const numOfResults = totalRows[0].totRows;
  const numberOfPages = Math.ceil(numOfResults / resultsPerPage);

  let page = req.query.page ? Number(req.query.page) : 1;
  if(page > numberOfPages){
    res.redirect('/admin/product?page='+encodeURIComponent(numberOfPages));
  }else if(page < 1){
    res.redirect('/admin/product?page='+encodeURIComponent('1'));
  }

  const startingLimit = (page - 1) * resultsPerPage;
  let [rows] = '';
  if(cateId != null && cateId != '' && cateId == 'all'){
    [rows] = await pool.query(" SELECT * FROM PRODUCT ORDER BY id ASC LIMIT ? , ? ", [startingLimit , resultsPerPage ]);
  } else if (cateId != null && cateId != ''){
    [rows] = await pool.query(" SELECT * FROM PRODUCT WHERE CATEGORY = ? ORDER BY id ASC LIMIT ? , ? ", [cateId , startingLimit , resultsPerPage ]);
  } else {
    req.flash("message", "에러발생");
    return res.redirect("/");
  }
  let iterator = (page - 5) < 1 ? 1 : page - 5;
  let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);

  res.render("admin/product", { productList: rows , categoryList: cateRows ,  page, iterator, endingLink, numberOfPages, cateId  });
}

export const addProduct = async (req, res) => {
  const [cateRows] = await pool.query(" SELECT * FROM CATEGORY WHERE isUse = 'Y' ");
  res.render("admin/addProduct" , {categoryList: cateRows} );
};

export const addProductProc = async (req, res) => {

  let data = {};
  let files = {};
  let title = '';
  let sku = '';
  let price = '';
  let discount = '';
  let fileName = '';
  let category = '';

  const form = new multiparty.Form({
    autoFiles: false,
    //uploadDir: "D:\\dev\\workspace\\binoo\\src\\public\\uploads",
    uploadDir: uploadDir,
    maxFilesSize: 1024 * 1024 * 5
  });

  function ondata(name, val, data){
    if (Array.isArray(data[name])) {
      data[name].push(val);
    } else if (data[name]) {
      data[name] = [data[name], val];
    } else {
      data[name] = val;
    }
  }

  form.on('field', function(name, val){
    ondata(name, val, data);
  });

  form.on('file', function(name, val){
    val.name = val.originalFilename;
    val.type = val.headers['content-type'] || null;
    ondata(name, val, files);
  });

  form.on('close', function() {
    req.body = qs.parse(data, { allowDots: true });
    req.files = qs.parse(files, { allowDots: true });
  });

  form.parse(req, function (error, fields, files) {
    let arr = [];
    arr = files.file1[0].path.split(/\\/);
    fileName = arr[arr.length-1];

    title = fields.title[0];
    sku = fields.sku[0];
    price = fields.price[0] ? Number(fields.price[0]) : 0;
    discount = fields.discount[0] ? Number(fields.discount[0]) : 0;
    category = fields.category[0] ? Number(fields.category[0]) : 1;

    pool.query(" INSERT INTO PRODUCT " +
        " (TITLE, SKU, PRICE, DISCOUNT, PICTUREURL, CATEGORY) " +
        " VALUES ( ?, ?, ?, ?, ?, ?) ", [title, sku, price, discount, fileName, category]);

  });

  res.render("admin/main");
  };

export const editProduct = async (req, res) => {
  const id = req.query.id;
  const [rows] = await pool.query("SELECT * FROM PRODUCT WHERE id = ?", [id]);
  const [cateRows] = await pool.query(" SELECT * FROM CATEGORY WHERE isUse = 'Y' ");
  res.render("admin/editProduct" , { product : rows[0] , categoryList: cateRows } );
};





