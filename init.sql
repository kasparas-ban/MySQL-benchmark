SET GLOBAL local_infile = TRUE;

CREATE TABLE IF NOT EXISTS `mysql_bench_db`.`user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(40) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_email` (`email` ASC) VISIBLE,
  INDEX `idx_users_deleted_at` (`deleted_at` ASC) VISIBLE,
  UNIQUE INDEX `idx_username` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
;

CREATE TABLE IF NOT EXISTS `mysql_bench_db`.`friendships` (
  `requester_id` BIGINT UNSIGNED NOT NULL,
  `addressee_id` BIGINT UNSIGNED NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_relationship` (`requester_id` ASC, `addressee_id` ASC) INVISIBLE,
  CONSTRAINT `fk_requester_id`
    FOREIGN KEY (`requester_id` , `addressee_id`)
    REFERENCES `mysql_bench_db`.`user` (`id` , `id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
;