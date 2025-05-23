FROM rust:1.65 as builder

RUN USER=root cargo new --bin faasbase-engine-service
WORKDIR ./faasbase-engine-service
COPY ./Cargo.toml ./Cargo.toml

ADD . ./
RUN cargo build --release


FROM debian:bullseye-slim

ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates tzdata libpq-dev gcc libc6-dev curl gnupg lsb-release \
    && rm -rf /var/lib/apt/lists/*
    # && sudo mkdir -p /etc/apt/keyrings
    # && curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    # && echo \
    # "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
    # $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    # && sudo apt-get update
    # && sudo apt-get install docker-ce docker-ce-cli containerd.io
    

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=builder /faasbase-engine-service/target/release/faasbase-engine-service ${APP}/faasbase-engine-service

RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

CMD ["./faasbase-engine-service"]