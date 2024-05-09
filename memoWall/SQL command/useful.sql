TRUNCATE TABLE memos;

SELECT * FROM memos;

CREATE TABLE user_memo_like (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    memo_id INTEGER
);

pgClient.query("SELECT memos.id,users.id,name,password FROM users INNER JOIN memos ON email = $1",[(email)])

(`INSERT INTO user_memo_like (user_id,memo_id)
VALUES ($1,$2)`,[userId,memoId])

INSERT INTO user_memo_like (user_id,memo_id) VALUES (1,2);
INSERT INTO user_memo_like (user_id,memo_id) VALUES (1,3);
INSERT INTO user_memo_like (user_id,memo_id) VALUES (1,5);

SELECT user_id,memo_id,memos.id,content,image,updated_at FROM user_memo_like INNER JOIN memos ON user_id = 1;





SELECT user_id,
memo_id AS memo_id,
CASE WHEN memo_id > 0 THEN 1 ELSE 0 END AS memo_id_liked,
memos.id AS all_memo_id,
content,
image 
FROM user_memo_like 
RIGHT OUTER JOIN memos ON memo_id = memos.id 
ORDER BY updated_at DESC;


INSERT INTO user_memo_like (user_id,memo_id) 
VALUES (1, 23);

DELETE FROM user_memo_like 
WHERE (user_id=1 AND memo_id=3);


SELECT 
CASE WHEN memo_id > 0 THEN 1 ELSE 0 END AS memo_id_liked,
memos.id AS memos_id,
content,
image 
FROM user_memo_like 
RIGHT OUTER JOIN memos ON memo_id = memos.id 
WHERE memos.id = 29;

