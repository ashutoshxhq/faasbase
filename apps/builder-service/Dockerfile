FROM rust:1.65 as builder

RUN USER=root cargo new --bin build-worker
WORKDIR ./build-worker
COPY ./Cargo.toml ./Cargo.toml
ADD . ./
RUN cargo build --release


FROM debian:bullseye-slim

ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates tzdata libpq-dev gcc libc6-dev curl unzip gnupg lsb-release \
    && rm -rf /var/lib/apt/lists/*
    
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=builder /build-worker/target/release/build-worker ${APP}/build-worker

RUN chown -R $APP_USER:$APP_USER ${APP}
USER $APP_USER
WORKDIR ${APP}

CMD ["./build-worker"]