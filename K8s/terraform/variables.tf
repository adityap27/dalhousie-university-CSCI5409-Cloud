variable "project_id" {
  default     = "csci-5409-cloud-computing-w24"
  description = "project id"
}

variable "region" {
  default     = "us-central1"
  description = "region of the gcp provider"
}

variable "location" {
  default     = "us-central1-c"
  description = "zone of the cluster nodes"
}

variable "node_count" {
  default     = 1
  description = "number of nodes to create in the cluster"
}
