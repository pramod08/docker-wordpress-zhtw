FROM ubuntu:14.04
MAINTAINER John Fink <john.fink@gmail.com>
RUN apt-get update # Mon Jan 27 11:35:22 EST 2014
RUN apt-get -y upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install zip curl git mysql-client mysql-server apache2 libapache2-mod-php5 pwgen python-setuptools vim-tiny php5-mysql openssh-server sudo php5-ldap
RUN easy_install supervisor
ADD ./scripts/start.sh /start.sh
ADD ./scripts/foreground.sh /etc/apache2/foreground.sh
ADD ./configs/supervisord.conf /etc/supervisord.conf
ADD ./configs/000-default.conf /etc/apache2/sites-available/000-default.conf
RUN echo %sudo	ALL=NOPASSWD: ALL >> /etc/sudoers
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
RUN chown -R www-data:www-data /var/www/
RUN chmod 755 /start.sh
RUN chmod 755 /etc/apache2/foreground.sh
RUN mkdir /var/log/supervisor/ && mkdir /var/run/sshd
# For not zh_TW version
RUN sed -i "s/'WPLANG', ''/'WPLANG', 'zh_TW'/g" /var/www/wp-config-sample.php
#
# install json api
#
RUN cd /var/www/wp-content/plugins/ && \
   wget -q http://downloads.wordpress.org/plugin/json-api.1.1.1.zip -O json-api.zip && \
   unzip json-api.zip && chown -R www-data:www-data json-api &&\
   rm json-api.zip
EXPOSE 80
EXPOSE 22
CMD ["/bin/bash", "/start.sh"]
