export const gae =
  `# Google App Engine Config: https://cloud.google.com/appengine/docs/flexible/custom-runtimes/configuring-your-app-with-app-yaml
runtime: custom
env: flex
instance_class: F1
automatic_scaling:
  min_num_instances: 1
  max_num_instances: 8
  cool_down_period_sec: 180
  cpu_utilization:
    target_utilization: 0.6
  target_concurrent_requests: 100`;
