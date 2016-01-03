
CREATE DATABASE IF NOT EXISTS swmem;
ALTER SCHEMA `swmem`  DEFAULT CHARACTER SET utf8 ;
use swmem;


---------------------------  유져 관련 디비   -------------------------------------

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE t_user ( u_id VARCHAR(20) NOT NULL primary key,
  u_password VARCHAR(100) NOT NULL,
  u_name VARCHAR(20),
  u_sex int,
  u_birth VARCHAR(10),
  u_phone VARCHAR(20),
  u_email VARCHAR(40),
  u_state int,
  u_period VARCHAR(10),
  u_branch VARCHAR(10),
  u_device int,
  u_token VARCHAR(100),
  u_mileage int,
  u_good_duty_point int,
  u_bad_duty_point int,
  u_manager_bad_duty_point int,
  u_photo_url VARCHAR(200),
  u_last_duty DATE,
  u_register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

--  u_register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ---------------------------       유져 끝     -------------------------------------



  ---------------------------  도서 관련 디비   -------------------------------------

DROP TABLE IF EXISTS `t_book`;
CREATE TABLE t_book (
  b_id int NOT NULL auto_increment primary key,
  b_type int,
  b_name VARCHAR(150),
  b_isbn VARCHAR(20),
  b_author VARCHAR(100),
  b_publisher VARCHAR(30),
  b_location VARCHAR(10),
  b_photo_url VARCHAR(200),
  b_state int DEFAULT '0',
  b_total int,
  b_new int DEFAULT '1',
  b_price int,
  b_reserved_cnt int DEFAULT '0',
  b_due_date VARCHAR(20),
  b_rental_username VARCHAR(20)
  );CREATE TABLE t_book_apply (
  ba_id int NOT NULL auto_increment primary key,
  ba_type int,
  ba_user VARCHAR(20),
  ba_name VARCHAR(150),
  ba_isbn VARCHAR(20),
  ba_author VARCHAR(100),
  ba_publisher VARCHAR(30),
  ba_photo_url VARCHAR(200),
  ba_apply_date VARCHAR(20),
  ba_price int,
  FOREIGN KEY(ba_user) REFERENCES t_user(u_id));


DROP TABLE IF EXISTS `t_book_return`;
CREATE TABLE t_book_return (
  brt_id int NOT NULL auto_increment primary key,
  brt_user VARCHAR(20),
  brt_book_id int,
  brt_return_date VARCHAR(20),
  brt_rental_date VARCHAR(20),
  FOREIGN KEY(brt_book_id) REFERENCES t_book(b_id),
  FOREIGN KEY(brt_user) REFERENCES t_user(u_id));

DROP TABLE IF EXISTS `t_book_rental`;
CREATE TABLE t_book_rental (
  br_id int NOT NULL auto_increment primary key,
  br_user VARCHAR(20),
  br_book_id int,
  br_rental_date VARCHAR(20),
  br_extension_cnt int DEFAULT '0',
  FOREIGN KEY(br_book_id) REFERENCES t_book(b_id),
  FOREIGN KEY(br_user) REFERENCES t_user(u_id));


DROP TABLE IF EXISTS `t_book_reserve`;
CREATE TABLE t_book_reserve (
  bre_id int NOT NULL auto_increment primary key,
  bre_user VARCHAR(20),
  bre_book_id int,
  bre_reserve_date VARCHAR(20),
  bre_myturn int,
  FOREIGN KEY(bre_book_id) REFERENCES t_book(b_id),
  FOREIGN KEY(bre_user) REFERENCES t_user(u_id));

DROP TABLE IF EXISTS `t_book_loss`;
CREATE TABLE t_book_loss (
  brl_id int NOT NULL auto_increment primary key,
  brl_user VARCHAR(20),
  brl_book_id int,
  brl_loss_date VARCHAR(20),
  FOREIGN KEY(brl_book_id) REFERENCES t_book(b_id),
  FOREIGN KEY(brl_user) REFERENCES t_user(u_id));


---------------------------       도서 끝     -------------------------------------



---------------------------  하드웨어 관련 디비   -------------------------------------

DROP TABLE IF EXISTS `t_hardware`;
CREATE TABLE t_hardware (
  h_id int NOT NULL auto_increment primary key,
  h_type int,
  h_name VARCHAR(100),
  h_total int DEFAULT '1',
  h_remaining int DEFAULT '1'
);


DROP TABLE IF EXISTS `t_hardware_return`;
CREATE TABLE t_hardware_return (
  ht_id int NOT NULL auto_increment primary key,
  ht_user VARCHAR(20),
  ht_hardware_id int,
  ht_return_date VARCHAR(20),
  ht_rental_date VARCHAR(20),
  FOREIGN KEY(ht_hardware_id) REFERENCES t_hardware(h_id),
  FOREIGN KEY(ht_user) REFERENCES t_user(u_id)
  );





DROP TABLE IF EXISTS `t_hardware_rental`;
CREATE TABLE t_hardware_rental (
  hr_id int NOT NULL auto_increment primary key,
  hr_user VARCHAR(20),
  hr_hardware_id int,
  hr_rental_date VARCHAR(20),
  hr_due_date VARCHAR(20),
  hr_extension_cnt int DEFAULT '0',
  FOREIGN KEY(hr_hardware_id) REFERENCES t_hardware(h_id),
  FOREIGN KEY(hr_user) REFERENCES t_user(u_id)
  );


---------------------------       하드웨어 끝     -------------------------------------

---------------------------  회비 관련 디비   -------------------------------------



DROP TABLE IF EXISTS `t_fee_manage`;
  CREATE TABLE t_fee_manage ( fm_id int NOT NULL auto_increment primary key,
  fm_money_type boolean,
  fm_money_content char(200),
  fm_price int,
  fm_monthly_deposit int,
  fm_monthly_withdraw int,
  fm_remain_money int,
  fm_writer VARCHAR(20) NOT NULL,
  fm_date VARCHAR(20),
  fm_write_date VARCHAR(20),
  FOREIGN KEY(fm_writer) REFERENCES t_user(u_id));

DROP TABLE IF EXISTS `t_fee_type`;
  CREATE TABLE t_fee_type(
  ft_id int NOT NULL auto_increment primary key,
  ft_name char(20)
  );

DROP TABLE IF EXISTS `t_fee`;
  CREATE TABLE t_fee ( f_id int NOT NULL auto_increment primary key,
  f_payer VARCHAR(20) NOT NULL,
  f_name VARCHAR(20),
  f_content VARCHAR(200),
  f_type int NOT NULL,
  f_price int,
  f_state BOOLEAN,
  f_write_date VARCHAR(20),
  FOREIGN KEY(f_payer) REFERENCES t_user(u_id),
  FOREIGN KEY(f_type) REFERENCES t_fee_type(ft_id));


  ---------------------------       회비 끝     -------------------------------------



  ---------------------------  당직 관련 디비   -------------------------------------


  DROP TABLE IF EXISTS `t_duty`;
  CREATE TABLE `t_duty` (
    `date` date NOT NULL,
    `user_id1` varchar(40) DEFAULT NULL,
    `user_id2` varchar(40) DEFAULT NULL,
    `user_id3` varchar(40) DEFAULT NULL,
    `user_id4` varchar(40) DEFAULT NULL,
    `user1_mode` tinyint(4) DEFAULT NULL,
    `user2_mode` tinyint(4) DEFAULT NULL,
    `user3_mode` tinyint(4) DEFAULT NULL,
    `user4_mode` tinyint(4) DEFAULT NULL,
    `accepted` tinyint(1) DEFAULT '0',
    FOREIGN KEY(user_id1) REFERENCES t_user(u_id),
    FOREIGN KEY(user_id2) REFERENCES t_user(u_id),
    FOREIGN KEY(user_id3) REFERENCES t_user(u_id),
    FOREIGN KEY(user_id4) REFERENCES t_user(u_id),
    PRIMARY KEY (`date`)
  );


-- 0:wait 1:accept 2:decline
  DROP TABLE IF EXISTS `t_duty_change_history`;
  CREATE TABLE `t_duty_change_history` (
    `request_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `request_date1` date NOT NULL,
    `request_userid1` varchar(45) NOT NULL,
    `request_date2` date NOT NULL,
    `request_userid2` varchar(45) NOT NULL,
    `accepted` tinyint(2) NOT NULL DEFAULT '0',
    `index` int(11) NOT NULL AUTO_INCREMENT,
    FOREIGN KEY(request_userid1) REFERENCES t_user(u_id),
    FOREIGN KEY(request_userid2) REFERENCES t_user(u_id),
    PRIMARY KEY (`index`)
  );


  DROP TABLE IF EXISTS `t_duty_point_history`;
  CREATE TABLE `t_duty_point_history` (
    `date` date NOT NULL,
    `add_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `receive_user` varchar(40) NOT NULL,
    `send_user` varchar(40) NOT NULL,
    `mode` tinyint(4) NOT NULL,
    `point` tinyint(4) NOT NULL,
    `reason` varchar(250) NOT NULL,
    `index` int(20) NOT NULL AUTO_INCREMENT,
    FOREIGN KEY(receive_user) REFERENCES t_user(u_id),
    FOREIGN KEY(send_user) REFERENCES t_user(u_id),
    PRIMARY KEY (`index`)
  );

    ---------------------------       당직 끝     -------------------------------------


-------------------------------- 문의 ------------------------------------------
  CREATE TABLE t_qna (
    q_id int NOT NULL auto_increment primary key,
    q_title VARCHAR(200),
    q_content VARCHAR(1000),
    q_state int,
    q_writer VARCHAR(20),
    q_write_date VARCHAR(20),
    FOREIGN KEY(q_writer) REFERENCES t_user(u_id));


    CREATE TABLE t_qna_reply (
    qr_id int,
    qr_content VARCHAR(200),
    qr_writer VARCHAR(20),
    qr_write_date VARCHAR(20),
    FOREIGN KEY(qr_id) REFERENCES t_qna(q_id),
    FOREIGN KEY(qr_writer) REFERENCES t_user(u_id));

    -------------------------------- 자재 신청 ------------------------------------------
    CREATE TABLE t_apply(
    	a_id int NOT NULL auto_increment primary key,
    	a_apply_type int,
    	a_title VARCHAR(100),
    	a_weblink VARCHAR(200),
    	a_date VARCHAR(20),
    	a_due_date VARCHAR(20),
    	a_write_date VARCHAR(20),
    	a_writer VARCHAR(20),
      	FOREIGN KEY(a_writer) REFERENCES t_user(u_id));