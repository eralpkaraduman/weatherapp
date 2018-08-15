#!/usr/bin/env bash

gcloud config set project weather-app-213413
gcloud config set compute/zone us-west2
gcloud app deploy --version prod --promote --quiet --stop-previous-version
