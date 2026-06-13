FROM php:8.3-apache

WORKDIR /var/www/html

COPY . /var/www/html

RUN docker-php-ext-install curl

RUN a2enmod rewrite

EXPOSE 80
