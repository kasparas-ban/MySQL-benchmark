# Query time comparison between different database schemas

## User data

0.1M or 1M distinct users

## Friendships 1

10M relations (0.1M users with 100 friends each). I was unable to populate the database with 100M records - the process took >10h.

All friendships are duplicated (storing two separate relations for user-friend and friend-user). Only the first column (requester_id) is indexed.

```
CREATE TABLE IF NOT EXISTS `mysql_bench_db`.`friendships` (
  `requester_id` BIGINT UNSIGNED NOT NULL,
  `addressee_id` BIGINT UNSIGNED NOT NULL,
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`requester_id`)
  REFERENCES `mysql_bench_db`.`user` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);
```

## Friendships 2

5M/50M relations (0.1M/1M users with 100 friends each).

All friendships are unique - user-friend and friend-user relation is saved only once.

```
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
```

| Schemas       | Number of users/relations | Data generation time | Population time | Index size | Total table size | Query time |
| ------------- | ------------------------- | -------------------- | --------------- | ---------- | ---------------- | ---------- |
| User schema   | 100K/10M                  | <1 min               | <1 min          | ~110 Mb    | ~200 Mb          | Querying one random record ~60 ms |
| Friendships 1 | 100K/10M                  | <1 min               | ~20 min         | ~300 Mb    | ~735 Mb          | Querying all friends for one random user ~200 ms |
| Friendships 2 | 100K/5M                   | <1 min               | ? 3-5 min       | ~360 Mb    | ~370 Mb          | Querying all friends for one random user ~16 ms ? ~2.5 ms |
| Friendships 2 | 1M/50M                    | <4 min               | 25-30 min       | ~3.33 Gb   | ~3.33 Gb         | Querying all friends for one random user ~16 ms |

