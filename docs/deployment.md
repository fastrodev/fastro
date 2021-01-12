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

## Deploy webapp to cloud run
- Once your application is ready to use, you can easily deploy it with this command
    ```
    fastro deploy --name hello
    ``` 
- You can change webapp `name` with your own. 
    
- See an example of a deployed web application at this link [https://hello-6bxxicr2uq-uc.a.run.app](https://hello-6bxxicr2uq-uc.a.run.app)

- You can also change domain name with [google cloud run console](https://console.cloud.google.com/run).

## Deploy webbapp to app engine
 - Setup app engine sdk. Follow this guide: https://cloud.google.com/appengine/docs/flexible/custom-runtimes/quickstart#before_you_begin
 - Create `app.yaml` file
   ```
   runtime: custom
   env: flex
   automatic_scaling:
     min_num_instances: 1
     max_num_instances: 8
     cool_down_period_sec: 180
     cpu_utilization:
       target_utilization: 0.5
    target_concurrent_requests: 100
   ```
 - Deploy to app engine:
   ```
   gcloud app deploy
   ```
 - You can see the deployed webapp at this link: [https://phonic-altar-274306.ue.r.appspot.com/](https://phonic-altar-274306.ue.r.appspot.com/)

## What's next:
- [Fastro API](api.md)
