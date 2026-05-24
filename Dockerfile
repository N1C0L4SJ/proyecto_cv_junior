FROM nginx:alpine

# Borramos el contenido por defecto de Nginx para evitar conflictos
RUN rm -rf /usr/share/nginx/html/*

# Copiamos TODOS los archivos de tu carpeta CV_WEB al servidor
COPY . /usr/share/nginx/html/

# Exponemos el puerto 80 (opcional, pero buena práctica)
EXPOSE 80