## Instalation elastic search

Doc pour docker https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.7.1
docker network create elastic
docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.7.1
```

Recuperer les keys er mots de passes

Puis dans un nouveau termimal

```bash
docker cp es01:/usr/share/elasticsearch/config/certs/http_ca.crt .
curl --cacert http_ca.crt -u elastic https://localhost:9200
```

## Instalation kibana

Doc pour docker https://www.elastic.co/guide/en/kibana/current/docker.html

```bash
docker pull docker.elastic.co/kibana/kibana:8.7.1
docker run --name kib-01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.7.1
```

Acceder a http://0.0.0.0:5601/?code=701693

Saisir le enrollment token

Se connecter avec le mot de passe et l'utilisateur `elastic`

Acceder aux devtools et maniupler l'outil

## Manipulations

> Créer un index :

```
PUT /exemple_index
{
  "mappings": {
    "properties": {
      "titre": {
        "type": "text"
      },
      "date": {
        "type": "date"
      }
    }
  }
}

POST /exemple_index/_doc/1
{
  "titre": "Exemple de document",
  "date": "2023-05-24"
}
```

> Indexer des documents en lots (bulk) :

```
POST /nom_de_l_index/_bulk
{"index":{"_id":"1"}}
{"titre":"Document 1","date":"2023-05-24"}
{"index":{"_id":"2"}}
{"titre":"Document 2","date":"2023-05-25"}
{"index":{"_id":"3"}}
{"titre":"Document 3","date":"2023-05-26"}
```

> Rechercher dans les documents :

```
GET /nom_de_l_index/_search
{
  "query": {
    "match": {
      "titre": "document"
    }
  }
}
```

## Kaggle import

Dataset : https://www.kaggle.com/datasets/bilalwaseer/top-1000-bollywood-movies-and-their-box-office

Import dans l'index `movies` depuis http://0.0.0.0:5601/app/home#/tutorial_directory/fileDataViz

## Questions

> Comment Elasticsearch procède-t-il au mapping ?

Lorsqu'il indexe les données, la structure des documents dans un index sont mappés tout seuls.

> Peut-on modifier le mapping sans recréer l’index ?

Oui, parfois il faut réindexer des données existantes

```
PUT /nom_de_l_index/_mapping
{
  "properties": {
    "champ": {
      "type": "nouveau_type"
    }
  }
}
```

> Tokenisation :

Split d'un texte appelées "tokens" afin de faciliter l'indexation et la recherche de texte.

> Normalisation :

Formattage des tokens (slug, minuscule) afin d'améliorer la cohérence lors de la recherche.

On utilise des analyseurs pour effectuer la tokenisation et la normalisation.

> Lors de la démonstration nous avons évoqué la notion d’API, desquelles avons-nous parlé ?

Les API REST et les methodes permettant le CRUD (POST, GET, PUT)
