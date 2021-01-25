---
description: By default, you can deploy fastro web apps on Cloud Run, a fully managed serverless platform built by Google.
---

# Publishing and Deployment

By default, you can deploy fastro web apps on [Cloud Run](https://cloud.google.com/run), a fully managed serverless platform built by Google.

> *Cloud run abstracts all infrastructure management by automatically scaling up and down from zero almost instantaneously - depending on traffic. It also only charges you for the exact resources you use.*

## Install gcloud sdk (linux)
- Download [gcloud sdk](https://cloud.google.com/sdk)

    ```
    curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-315.0.0-linux-x86_64.tar.gz
    ```

- Extract the contents of the file to any location on your file system
    ```
    tar xvzf google-cloud-sdk-315.0.0-linux-x86_64.tar.gz
    ```

- Install gcloud sdk

    ```
    ./google-cloud-sdk/install.sh
    ```
- Create a google cloud project
    ```
    ./google-cloud-sdk/bin/gcloud init
    ```
    
    See [the cloud run quickstart](https://cloud.google.com/sdk/docs/quickstart) for detail instruction.

- [Deploy webapp to cloud run](run.md)
- [Deploy webbapp to app engine](gae.md)

## What's next:
- [Fastro API](api.md)
