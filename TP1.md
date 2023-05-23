## Instalation elastic search

Doc pour docker https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.7.1
docker network create elastic
docker run --name es01 --net elastic -p 9200:9200 -it docker.elastic.co/elasticsearch/elasticsearch:8.7.1
```

Je garde le mot de passe pour le user elastic: `iop+-JHVMKNAD\*g2rhLt`

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
