#backup the sql in user/backup/
mysqldump -utesting -pnccutest member | gzip > \Users\percomlab\implement\MVC_backend_example\member\BackupDB_`date +%F`.sql.gz

#三天前的資料自行刪除
find \Users\percomlab\implement\MVC_backend_example\member\BackupDB -type f -mtime +3 -exec rm {} +