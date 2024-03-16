# Reference: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster#example-usage---with-the-default-node-pool

resource "google_container_cluster" "k8s-assignment-cluster-1" {
  name     = "k8s-assignment-cluster-1"
  location = var.location

  initial_node_count = var.node_count

  node_config {
    machine_type = "e2-micro"
    disk_size_gb = 10
    disk_type    = "pd-standard"
  }

}
