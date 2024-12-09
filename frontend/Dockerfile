FROM node:22 AS development
#https://developer.android.com/build/releases/past-releases/agp-8-0-0-release-notes?hl=es-419
ARG JAVA_VERSION=17
ARG ANDROID_SDK_VERSION=11076708
ARG ANDROID_BUILD_TOOLS_VERSION=34.0.0
ARG ANDROID_PLATFORMS_VERSION=34

ARG ANDROID_HOME=/opt/android-sdk
ENV ANDROID_HOME=${ANDROID_HOME}

RUN npm install -g @angular/cli @ionic/cli @capacitor/cli
RUN apt-get update -q

RUN apt-get install -qy \
    apt-utils \
    locales \
    gnupg2 \
    build-essential \
    curl \
    usbutils \
    git \
    unzip \
    p7zip p7zip-full \
    python3 \
    openjdk-${JAVA_VERSION}-jre \
    openjdk-${JAVA_VERSION}-jdk

# Android SDK tools
RUN curl -sL https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    -o commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    && unzip commandlinetools-linux-${ANDROID_SDK_VERSION}_latest.zip \
    && mkdir $ANDROID_HOME && mv cmdline-tools $ANDROID_HOME \
    && yes | $ANDROID_HOME/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME --licenses \
    && $ANDROID_HOME/cmdline-tools/bin/sdkmanager --sdk_root=$ANDROID_HOME "platform-tools" "build-tools;${ANDROID_BUILD_TOOLS_VERSION}" "platforms;android-${ANDROID_PLATFORMS_VERSION}"
ENV PATH=$PATH:${ANDROID_HOME}/cmdline-tools:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/build-tools/${ANDROID_BUILD_TOOLS_VERSION}

# Limpieza
RUN apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*
RUN chown -R 1000:1000 ${ANDROID_HOME}
USER node:node
EXPOSE 4200
WORKDIR /frontend

#build stage
FROM development AS build
COPY --chown=1000:1000 ./package*.json /frontend
RUN npm install
COPY --chown=1000:1000 . /frontend
RUN npm run gradle
# run gradle ya ejecuta run build

# production stage
FROM nginx:alpine AS production
COPY --from=build /frontend/dist/frontend/browser /usr/share/nginx/html
COPY --from=build /frontend/android/app/build/outputs/apk/debug/app-debug.apk /usr/share/nginx/html/app/app-debug.apk
WORKDIR /usr/share/nginx/html
COPY nginx.default.conf.template /etc/nginx/templates/default.conf.template

CMD ["nginx", "-g", "daemon off;"]