# Autonomous Browser Assistant

This a demo project for autonomous browser, see more at https://docs.restack.io/examples/projects/autonomous-browser

## Run Restack Engine

```shell
docker run -d --pull always --name studio -p 5233:5233 -p 6233:6233 -p 7233:7233 ghcr.io/restackio/restack:main
```

Open Restack UI at [localhost:5233](http://localhost:5233)

### Run Frontend and Backend

Open frontend at [localhost:3000](http://localhost:3000)

### For Typescript:

```shell
pnpm i
```

```shell
pnpm dev:ts
```

### For Python:

```shell
cd apps/frontend
```

```shell
pnpm dev:py
```

```shell
cd apps/backend-python
```

```shell
poetry install
```

```shell
poetry shell
```

```shell
poetry run services
```
