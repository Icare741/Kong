#!/bin/sh

# Attendre que la base de données soit prête
until PGPASSWORD=$DB_PASSWORD psql -h "$1" -p "$2" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "Postgres n'est pas encore prêt - en attente..."
  sleep 1
done

>&2 echo "Postgres est prêt - exécution de la commande"
shift 2
exec "$@" 