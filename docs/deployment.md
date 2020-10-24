# Publishing and Deployment

By default, you can deploy fastro web apps on [Cloud Run](https://cloud.google.com/run), a fully managed serverless platform built by Google.

Cloud run abstracts all infrastructure management by automatically scaling up and down from zero almost instantaneously - depending on traffic. It also only charges you for the exact resources you use.

## Install gcloud sdk
- Download [gcloud sdk](https://cloud.google.com/sdk)

    ```
    curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-315.0.0-linux-x86_64.tar.gz
    ```

- Extract the contents of the file to any location on your file system. If you would like to replace an existing installation, remove the existing google-cloud-sdk directory and extract the archive to the same location
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

## Deploy webapp to cloud run
- After your webapp is ready to use, you can deploy and publish it with this command
    ```
    fastro deploy --name hello
    ``` 
- You can change webapp `name` with your own. 
    
- See an example of a deployed web application at this link [https://hello-6bxxicr2uq-uc.a.run.app](https://hello-6bxxicr2uq-uc.a.run.app)

- You can also change domain name with [google cloud run console](https://console.cloud.google.com/run).

## What's next:
- [Fastro API](api.md)