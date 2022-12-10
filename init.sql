CREATE TABLE IF NOT EXISTS `mysql_bench_db`.`user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `email` VARCHAR(40) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  -- UNIQUE INDEX `idx_relations` (`id`, `id`) VISIBLE,
  UNIQUE INDEX `idx_email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `idx_username` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
;

CREATE TABLE IF NOT EXISTS `mysql_bench_db`.`friendships` (
  `requester_id` BIGINT UNSIGNED NOT NULL,
  `addressee_id` BIGINT UNSIGNED NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `idx_relation` (`requester_id`, `addressee_id`) VISIBLE,
  FOREIGN KEY (`requester_id`)
  REFERENCES `mysql_bench_db`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (`addressee_id`)
  REFERENCES `mysql_bench_db`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

USE mysql_bench_db;

SET GLOBAL local_infile = TRUE;