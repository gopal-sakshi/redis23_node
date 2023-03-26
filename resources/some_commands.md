# start on other ports
redis-server --port 9001

edit the configuration files
    /etc/redis/redis.conf
    /etc/redis-stack.conf   // redis-stack-service.conf is copied to /etc for the systemctl case
    /opt/redis-stack/etc/




redis-cli ping                          // see if redis is running or not
redis-cli shutdown                      // shutdown redis-server (or) redis-stack-server
redis-cli           // by default connects to 6379 port
redis-cli -p 6378   // connects to 6378 port
