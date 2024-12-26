# SIF | SQL Insert Formatter

A simple tool to format SQL insert statement that vertically aligns column names and values for better readability.

## Overview

**Input**: 
```sql
insert into product_compositions (
  parent_product_id, child_product_id, 
  quantity, created_by, created_at
) 
values 
  (
    8, 3, 1, 'init_script', current_timestamp
  ), 
  (
    8, 4, 1, 'init_script', current_timestamp
  ), 
  (
    1, 2, 20, 'init_script', current_timestamp
  );
```
**Output**:
```sql
insert into product_compositions (
 parent_product_id, child_product_id, quantity, created_by   , created_at        
) values
(8                , 3               , 1       , 'init_script', current_timestamp),
(8                , 4               , 1       , 'init_script', current_timestamp),
(1                , 2               , 20      , 'init_script', current_timestamp);
```

## License

This project is licensed under the MIT License.

You can read the full license [here](LICENSE).
