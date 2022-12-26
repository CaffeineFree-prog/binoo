
CREATE SCHEMA `shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `shop`.`user` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`fullName` VARCHAR(200) NULL DEFAULT NULL,
`mobile` VARCHAR(15) NULL,
`email` VARCHAR(100) NULL,
`passwordHash` VARCHAR(60) NOT NULL,
`isAdmin` TINYINT(1) NOT NULL DEFAULT 0,
`registeredAt` DATETIME NOT NULL,
`lastLogin` DATETIME NULL DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `uq_mobile` (`mobile` ASC),
UNIQUE INDEX `uq_email` (`email` ASC) );

CREATE TABLE `shop`.`product` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`category` BIGINT NULL,
`userId` BIGINT NOT NULL,
`title` VARCHAR(75) NOT NULL,
`metaTitle` VARCHAR(100) NULL,
`pictureUrl` VARCHAR(500) NULL,
`summary` TINYTEXT NULL,
`type` SMALLINT(6) NOT NULL DEFAULT 0,
`sku` VARCHAR(100) NOT NULL,
`price` FLOAT NOT NULL DEFAULT 0,
`discount` FLOAT NOT NULL DEFAULT 0,
`quantity` SMALLINT(6) NOT NULL DEFAULT 0,
`shop` TINYINT(1) NOT NULL DEFAULT 0,
`createdAt` DATETIME NOT NULL DEFAULT now(),
`updatedAt` DATETIME NULL DEFAULT NULL,
`publishedAt` DATETIME NULL DEFAULT NULL,
`startsAt` DATETIME NULL DEFAULT NULL,
`endsAt` DATETIME NULL DEFAULT NULL,
`content` TEXT NULL DEFAULT NULL,
PRIMARY KEY (`id`),
UNIQUE INDEX `uq_slug` (`slug` ASC),
INDEX `idx_product_user` (`userId` ASC),
CONSTRAINT `fk_product_user`
  FOREIGN KEY (`userId`)
      REFERENCES `shop`.`user` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);

CREATE TABLE `shop`.`product_review` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`productId` BIGINT NOT NULL,
`parentId` BIGINT NULL DEFAULT NULL,
`title` VARCHAR(100) NOT NULL,
`rating` SMALLINT(6) NOT NULL DEFAULT 0,
`published` TINYINT(1) NOT NULL DEFAULT 0,
`createdAt` DATETIME NOT NULL,
`publishedAt` DATETIME NULL DEFAULT NULL,
`content` TEXT NULL DEFAULT NULL,
PRIMARY KEY (`id`),
INDEX `idx_review_product` (`productId` ASC),
CONSTRAINT `fk_review_product`
 FOREIGN KEY (`productId`)
     REFERENCES `shop`.`product` (`id`)
     ON DELETE NO ACTION
     ON UPDATE NO ACTION);

ALTER TABLE `shop`.`product_review`
    ADD INDEX `idx_review_parent` (`parentId` ASC);
ALTER TABLE `shop`.`product_review`
    ADD CONSTRAINT `fk_review_parent`
        FOREIGN KEY (`parentId`)
            REFERENCES `shop`.`product_review` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;

CREATE TABLE `shop`.`category` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`title` VARCHAR(75) NOT NULL,
`metaTitle` VARCHAR(100) NULL DEFAULT NULL,
`slug` VARCHAR(100) NOT NULL,
`content` TEXT NULL DEFAULT NULL,
PRIMARY KEY (`id`));

---------------------------수정
ALTER TABLE `shop`.`category`
DROP FOREIGN KEY `fk_category_parent`;
ALTER TABLE `shop`.`category`
DROP COLUMN `slug`,
DROP COLUMN `parentId`,
ADD COLUMN `use` CHAR(1) NULL DEFAULT 'Y' AFTER `content`,
CHANGE COLUMN `title` `productId` BIGINT NULL ,
CHANGE COLUMN `metaTitle` `name` VARCHAR(100) NULL DEFAULT NULL ,
DROP INDEX `idx_category_parent` ;
;
---------------------------수정


ALTER TABLE `shop`.`category`
    ADD INDEX `idx_category_parent` (`parentId` ASC);
ALTER TABLE `shop`.`category`
    ADD CONSTRAINT `fk_category_parent`
        FOREIGN KEY (`parentId`)
            REFERENCES `shop`.`category` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;


CREATE TABLE `shop`.`cart_item` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`productId` BIGINT NOT NULL,
`cartId` BIGINT NOT NULL,
`sku` VARCHAR(100) NOT NULL,
`price` FLOAT NOT NULL DEFAULT 0,
`discount` FLOAT NOT NULL DEFAULT 0,
`quantity` SMALLINT(6) NOT NULL DEFAULT 0,
`active` TINYINT(1) NOT NULL DEFAULT 0,
`createdAt` DATETIME NOT NULL,
`updatedAt` DATETIME NULL DEFAULT NULL,
`content` TEXT NULL DEFAULT NULL,
PRIMARY KEY (`id`),
INDEX `idx_cart_item_product` (`productId` ASC),
CONSTRAINT `fk_cart_item_product`
    FOREIGN KEY (`productId`)
        REFERENCES `shop`.`product` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION);

ALTER TABLE `shop`.`cart_item`
    ADD INDEX `idx_cart_item_cart` (`cartId` ASC);

CREATE TABLE `shop`.`order` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`userId` BIGINT NULL DEFAULT NULL,
`sessionId` VARCHAR(100) NOT NULL,
`token` VARCHAR(100) NOT NULL,
`status` SMALLINT(6) NOT NULL DEFAULT 0,
`subTotal` FLOAT NOT NULL DEFAULT 0,
`itemDiscount` FLOAT NOT NULL DEFAULT 0,
`tax` FLOAT NOT NULL DEFAULT 0,
`shipping` FLOAT NOT NULL DEFAULT 0,
`total` FLOAT NOT NULL DEFAULT 0,
`promo` VARCHAR(50) NULL DEFAULT NULL,
`discount` FLOAT NOT NULL DEFAULT 0,
`grandTotal` FLOAT NOT NULL DEFAULT 0,
`fullName` VARCHAR(200) NULL DEFAULT NULL,
`mobile` VARCHAR(15) NULL,
`email` VARCHAR(100) NULL,
`postalAddress` VARCHAR(500) NULL DEFAULT NULL,
`createdAt` DATETIME NOT NULL,
`updatedAt` DATETIME NULL DEFAULT NULL,
`content` TEXT NULL DEFAULT NULL,
PRIMARY KEY (`id`),
INDEX `idx_order_user` (`userId` ASC),
CONSTRAINT `fk_order_user`
    FOREIGN KEY (`userId`)
        REFERENCES `shop`.`user` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION);

CREATE TABLE `shop`.`order_item` (
 `id` BIGINT NOT NULL AUTO_INCREMENT,
 `productId` BIGINT NOT NULL,
 `orderId` BIGINT NOT NULL,
 `sku` VARCHAR(100) NOT NULL,
 `price` FLOAT NOT NULL DEFAULT 0,
 `discount` FLOAT NOT NULL DEFAULT 0,
 `quantity` SMALLINT(6) NOT NULL DEFAULT 0,
 `createdAt` DATETIME NOT NULL,
 `updatedAt` DATETIME NULL DEFAULT NULL,
 `content` TEXT NULL DEFAULT NULL,
 PRIMARY KEY (`id`),
 INDEX `idx_order_item_product` (`productId` ASC),
 CONSTRAINT `fk_order_item_product`
     FOREIGN KEY (`productId`)
         REFERENCES `shop`.`product` (`id`)
         ON DELETE NO ACTION
         ON UPDATE NO ACTION);

ALTER TABLE `shop`.`order_item`
    ADD INDEX `idx_order_item_order` (`orderId` ASC);
ALTER TABLE `shop`.`order_item`
    ADD CONSTRAINT `fk_order_item_order`
        FOREIGN KEY (`orderId`)
            REFERENCES `shop`.`order` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;

CREATE TABLE `shop`.`transaction` (
`id` BIGINT NOT NULL AUTO_INCREMENT,
`userId` BIGINT NOT NULL,
`orderId` BIGINT NOT NULL,
`code` VARCHAR(100) NOT NULL,
`type` SMALLINT(6) NOT NULL DEFAULT 0,
`mode` SMALLINT(6) NOT NULL DEFAULT 0,
`status` SMALLINT(6) NOT NULL DEFAULT 0,
`createdAt` DATETIME NOT NULL,
`updatedAt` DATETIME NULL DEFAULT NULL,
`content` TEXT NULL DEFAULT NULL,
PRIMARY KEY (`id`),
INDEX `idx_transaction_user` (`userId` ASC),
CONSTRAINT `fk_transaction_user`
  FOREIGN KEY (`userId`)
      REFERENCES `shop`.`user` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION);

ALTER TABLE `shop`.`transaction`
    ADD INDEX `idx_transaction_order` (`orderId` ASC);
ALTER TABLE `shop`.`transaction`
    ADD CONSTRAINT `fk_transaction_order`
        FOREIGN KEY (`orderId`)
            REFERENCES `shop`.`order` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;


INSERT INTO PRODUCT (ID, TITLE, PICTUREURL, SUMMARY, TYPE, SKU , PRICE, DISCOUNT , QUANTITY , SHOP , CREATEDAT, PUBLISHEDAT , STARTSAT, ENDSAT , CATEGORY)
VALUES (0, '비누1', '/img/soaps/1.jpeg' , '내용입니다' , 0, 100 , 5000, 0 , 10 , 1 , NOW(), NOW(), NOW() , NOW()+100 ,0);
INSERT INTO PRODUCT (ID, TITLE, PICTUREURL, SUMMARY, TYPE, SKU , PRICE, DISCOUNT , QUANTITY , SHOP , CREATEDAT, PUBLISHEDAT , STARTSAT, ENDSAT , CATEGORY)
VALUES (1, '비누2GG', '/img/soaps/2.jpeg' , '내용GG' , 0, 110 , 3000, 0 , 20 , 1 , NOW(), NOW(), NOW() , NOW()+100 ,0);
INSERT INTO PRODUCT (ID, TITLE, PICTUREURL, SUMMARY, TYPE, SKU , PRICE, DISCOUNT , QUANTITY , SHOP , CREATEDAT, PUBLISHEDAT , STARTSAT, ENDSAT , CATEGORY)
VALUES (3, 'GG', '/img/soaps/3.jpeg' , 'ASDFASDF' , 0, 1000 , 3000, 0 , 10 , 1 , NOW(), NOW(), NOW() , NOW() ,0);
INSERT INTO PRODUCT (ID, TITLE, PICTUREURL, SUMMARY, TYPE, SKU , PRICE, DISCOUNT , QUANTITY , SHOP , CREATEDAT, PUBLISHEDAT , STARTSAT, ENDSAT , CATEGORY)
VALUES (4, '455431', '/img/soaps/4.jpeg' , 'A@@##@F' , 0, 10000 , 500, 0 , 30 , 1 , NOW(), NOW(), NOW() , NOW() ,1);

insert into category values (1, '비누' , '비누입니다' , 'Y');
insert into category values (2, '샴푸' , '샴푸임' , 'Y');
insert into category values (3, '바디워시' , '바디바디' , 'Y');

ALTER TABLE `shop`.`product_review`
DROP FOREIGN KEY `fk_review_parent`;
ALTER TABLE `shop`.`product_review`
DROP COLUMN `publishedAt`,
DROP COLUMN `published`,
DROP COLUMN `parentId`,
ADD COLUMN `userId` BIGINT NOT NULL AFTER `content`,
CHANGE COLUMN `rating` `rating` TINYINT ZEROFILL NOT NULL DEFAULT 100 ,
CHANGE COLUMN `createdAt` `createdAt` DATETIME NOT NULL DEFAULT NOW() ,
ADD INDEX `fk_review_user_idx` (`userId` ASC) VISIBLE,
DROP INDEX `idx_review_parent` ;
;
ALTER TABLE `shop`.`product_review`
    ADD CONSTRAINT `fk_review_user`
        FOREIGN KEY (`userId`)
            REFERENCES `shop`.`user` (`id`)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION;

insert into product_review values (1, 1, '타이틀11', 100, now(), '후기 내용' ,1);
insert into product_review values (2, 1, '타이틀1ㅁㄴㅇㄹㄴㅇㄹ1', 90, now(), '후기 내용' ,2);
insert into product_review values (3, 1, '타이', 80, now(), '후기 ㅁㄴㄹㅇㄴㅁㅇㄹ내용' ,3);
insert into product_review values (4, 1, '타이틀11ㅇㄴ2332', 100, now(), '후ㄴㅁㅇㄹㄴㅇㄻㄴㅇㄹ기 내용' ,1);
insert into product_review values (5, 2, '타이1', 100, now(), '후용' ,2);
insert into product_review values (6, 1, 'ㄴㅇㄹ1', 35, now(), '내용' ,20);
