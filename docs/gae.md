## Deploy webbapp to app engine
 - Setup app engine sdk  
   Follow this guide: [Quickstart for Custom Runtimes in the App Engine Flexible Environment](https://cloud.google.com/appengine/docs/flexible/custom-runtimes/quickstart#before_you_begin)
   
 - Create `app.yaml` file in root project directory
   ```
   runtime: custom
   env: flex
   manual_scaling:
     instances: 1
   resources:
     cpu: 1
     memory_gb: 0.5
     disk_size_gb: 10
   ```
 - Deploy to app engine:
   ```
   gcloud app deploy
   ```
