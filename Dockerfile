FROM postgres:latest

ENV POSTGRES_USER=database
ENV POSTGRES_PASSWORD=database
ENV POSTGRES_DB=database

EXPOSE 5432

CMD ["postgres"]
