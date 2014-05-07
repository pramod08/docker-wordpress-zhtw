FROM ubuntu:14.04
MAINTAINER Y12STUDIO <y12studio@gmail.com>
RUN apt-get update
RUN apt-get -y upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install nano zip curl git mysql-client mysql-server apache2 libapache2-mod-php5 pwgen python-setuptools php5-mysql openssh-server sudo php5-ldap php5-curl
RUN rm -rf /var/www/
# Only for English version
# ADD http://wordpress.org/latest.tar.gz /wordpress.tar.gz
# sed start issue https://github.com/y12studio/y12wordpress/issues/1
RUN wget -q http://wordpress.org/latest.tar.gz -O wordpress-en.tar.gz
RUN wget -q http://tw.wordpress.org/latest-zh_TW.tar.gz -O wordpress.tar.gz
RUN tar xvzf /wordpress.tar.gz && mv /wordpress /var/www/
# move en-version to /var/www for sed-safety
RUN tar xvzf /wordpress-en.tar.gz && mv -f /wordpress/wp-config-sample.php /var/www/
RUN rm /wordpress.tar.gz && rm /wordpress-en.tar.gz && rm -rf /wordpress
RUN easy_install supervisor
ADD ./scripts/foreground.sh /etc/apache2/foreground.sh
ADD ./configs/supervisord.conf /etc/supervisord.conf
RUN chmod 755 /etc/apache2/foreground.sh
RUN mkdir /var/log/supervisor/ && mkdir /var/run/sshd
#
# json CORS support
# apache .htaccess are ignored when AllowOverride None
# RUN echo 'Header set Access-Control-Allow-Origin "*"' > /var/www/.htaccess
# ADD ./configs/htaccess-cors /var/www/.htaccess
#
ADD ./configs/000-default.conf /etc/apache2/sites-available/000-default.conf 
RUN a2enmod headers
ADD ./scripts/start.sh /start.sh
RUN chmod 755 /start.sh
RUN chmod u+s /usr/bin/sudo
#
# add user
#
RUN mkdir -p /home/docker &&\
   useradd docker &&\
   echo "docker:docker" | chpasswd &&\
   mkdir -p /home/docker/.ssh; chmod 700 /home/docker/.ssh &&\
   chown -R docker /home/docker &&\
   echo "docker ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
#
# Install Node.js
RUN apt-get install -y software-properties-common && \
    add-apt-repository -y ppa:chris-lea/node.js && \
	apt-get update && apt-get install -y nodejs &&\
	npm install -g grunt-cli

ADD ./scripts/package.json /home/docker/
ADD ./scripts/Gruntfile.js /home/docker/
RUN cd /home/docker && su docker -c 'npm install'
   
RUN mkdir /etc/apache2/ssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key \
    -out /etc/apache2/ssl/apache.crt \
	-subj "/C=TW/ST=Taichung/L=Xitun/OU=Y12STUDIO/O=WordPressDev/CN=dev.y12.tw"  
	
ADD ./configs/000-default-ssl.conf /etc/apache2/sites-available/default-ssl.conf

# wp-config.php
# define('WP_DEBUG', false);
# define('FORCE_SSL_ADMIN', true);
# /* That's all, stop editing! Happy blogging. */
# zh_TW 
# RUN sed -i "s/'WPLANG', ''/'WPLANG', 'zh_TW'/g" /var/www/wp-config-sample.php

RUN sed -i "s/define('WP_DEBUG', false);/define('WP_DEBUG', false);\r\ndefine('FORCE_SSL_ADMIN', true);/g" /var/www/wp-config-sample.php

RUN a2enmod ssl && a2ensite default-ssl.conf

EXPOSE 443

#
# footer expose 80 http /22 ssh
EXPOSE 80
EXPOSE 22
CMD ["/bin/bash", "/start.sh"]
